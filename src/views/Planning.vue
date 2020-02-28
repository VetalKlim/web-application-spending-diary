<template>
  <form v-on:submit.prevent="onLimit" class="planning-block">
    <div class="page-title">
      <div class="planing-title">
        <h3 class="title-text-planning">{{'planning_planning'|localize}}</h3>
        <div>
          <span
            class="center nowMany-planning"
          >{{'current amount'| localize}} {{ info.bill | currency('UAH')}}</span>
        </div>
      </div>

      <div class="planing-title">
        <h3 class="title-text-planning">{{'planning_your_limit'| localize}}</h3>
        <span v-if="info.limit >0 " class="center limit-planning">{{info.limit | currency('UAH')}}</span>
        <span v-else class="center limit-planning">{{'planning_no_limit_specified'|localize}}</span>
      </div>
    </div>

    <AmountOfTheCurrentMonth />

    <Loader v-if="loading" />
    <p class="center" v-else-if="categories.length === 0">
      <span class="center text-category-no">{{'planning_categories_not_yet_added'|localize}} .</span>
      <br />
      <router-link to="/categories">
        <span class="btn addCategoty-planning">{{'planning_add_category'| localize }}</span>
      </router-link>
    </p>
    <div class="limit-block" v-else-if="info.limit > 0">
      <!-- если в лимите больше 0 то показываем этот блок -->
      <p>
        <strong>{{'planning_sent'| localize}} :</strong>
        {{ dataInfo.expensesForTheCurrentMonth | currency('UAH') }} {{'planning_of'| localize}} {{info.limit | currency('UAH')}}
    
      </p>
      <div
        class="progress progress-options"
        v-tooltip="{html: dataInfo.tooltip, outDuration: 500 } "
      >
        <div
          class="determinate"
          :class="[dataInfo.progressColor]"
          :style="{width: dataInfo.progressPercent + '%'}"
        ></div>
       
      </div>
      <div class="planning-user">
        <div class="input-field col s6">
          <input
            id="limitUser"
            type="number"
            v-model.number="limit"
            v-bind:class="{invalid: $v.limit.$dirty && !$v.limit.required}"
          />
          <label
            class="limit-text-placeholder"
            for="limitUser"
          >{{'planning_Enter_the_limit_for_the_current_month'| localize}}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.required"
            class="helper-text invalid"
          >{{'planning_Enter_the_correct_number'| localize}}</span>
        </div>
      </div>
      <button class="btn waves-effect waves-light btn-limit">
        {{'planning_change_current_month_limit'| localize}}
        <i class="material-icons right">send</i>
      </button>
    </div>
    <div v-else-if="info.limit === 0">
      <!-- если в лимите 0 то показываем этот блок -->
      <div class="planning-user">
        <div class="input-field col s6">
          <input
            id="limitUser"
            type="number"
            v-model.number="limit"
            v-bind:class="{invalid: $v.limit.$dirty && !$v.limit.required}"
          />
          <label
            class="limit-text-placeholder"
            for="limitUser"
          >{{'planning_Enter_the_limit_for_the_current_month'| localize}}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.required"
            class="helper-text invalid"
          >{{'planning_Enter_the_correct_number'| localize}}</span>
        </div>
      </div>
      <button class="btn waves-effect waves-light btn-limit">
        {{'planning_set_a_limit_for_the_current_month' |localize}}
        <i
          class="material-icons right"
        >send</i>
      </button>
    </div>
  </form>
</template>
<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import currencyFilter from "@/filters/currency.filter.js";
import localizeFilter from "@/filters/localize.filter.js";
import AmountOfTheCurrentMonth from "@/components/app/AmountOfTheCurrentMonth.vue";
export default {
  metaInfo() {
    return {
      title: this.$title("planning")
    };
  },
  name: "planning",
  data: () => ({
    loading: true,
    categories: [],
    dataInfo: null,
    limit: "",
    limitBlock: false,
    records: null
  }),
  components: {
    AmountOfTheCurrentMonth
  },
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
    this.expensesForTheCurrentMonth(this.records);
  },
  computed: {
    ...mapGetters(["info"])
  },
  validations: {
    limit: {
      required
    }
  },
  methods: {
    expensesForTheCurrentMonth(records) {
      let recordsNowMonth = records.filter(
        r =>
          r.dateMonth === moment().format("MM") &&
          r.dateYear === moment().format("YYYY")
      );
      let typeAmount = recordsNowMonth.filter(function(el) {
        return el.type === "outcome";
      });

      let expensesForTheCurrentMonth = typeAmount.reduce(function(el, record) {
        return (el += +record.amount);
      }, 0);
      const percent =
        (100 * expensesForTheCurrentMonth) / this.$store.getters.info.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      let tooltipValue =
        this.$store.getters.info.limit - expensesForTheCurrentMonth;
      let tooltip = `${
        tooltipValue < 0
          ? `${localizeFilter("planning_You_have_increased_the_cost_of")}`
          : `${localizeFilter("planning_You_have_funds_left")}`
      } ${currencyFilter(Math.abs(tooltipValue))}`;
      const progressColor =
        percent < 60 ? "green" : percent < 90 ? "yellow" : "red";
      this.dataInfo = {
        expensesForTheCurrentMonth,
        progressPercent,
        progressColor,
        tooltip
      };
    },
    async onLimit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        let limit = this.limit;
        await this.$store.dispatch("updateInfo", { limit });
        this.$message(
          `${localizeFilter("planning_limit_set_successfully")} ${currencyFilter(this.limit) } `
        );
        this.limit = "";
        this.expensesForTheCurrentMonth(this.records);
      } catch (error) {}
    },
    openLimitBlock() {
      this.limitBlock = true;
    }
  }
};
</script>
<style lang="scss">
.planning-block {
  // background: #e1e1e1;
  padding: 20px;
  border-radius: 5px;
  .addCategoty-planning {
    width: auto;
  }
  .page-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
    border-bottom: none;
    .title-text-planning {
      margin: 0;
      font-size: 22px;
      color: #144d56;
      font-style: italic;
    }
    .planing-title {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .nowMany-planning,
      .limit-planning {
        display: block;
        margin-top: 10px;
        color: #26a69a;
        border-bottom: 1px solid #26a69a;
      }
    }
  }
  .limit-block {
    margin-top: 45px;
  }

  .text-category-no {
    padding: 10px;
    margin: 10px;
    display: inline-block;
    color: #26a69a;
    font-size: 20px;
    font-style: italic;
    width: 30%;
  }
  .progress-options {
    height: 30px;
    border-radius: 5px;
    border: 1px solid silver;
    box-shadow: 0px 0px 4px#26A69A;
  }
  .planning-user {
    margin: 10px 10px 5px 0px;
    padding: 10px 10px 0px 0px;
    width: 50%;
    .btn-limit {
      margin: 10px 10px 10px 10px;
      padding: 10px 10px 10px 10px;
    }
  }
}
@media all and (max-width: 600px) {
  .planning-block {
    padding: 10px;
    .page-title {
      .planing-title {
        .title-text-planning {
          font-size: 18px;
        }
        .nowMany-planning,
        .limit-planning {
          font-size: 12px !important;
        }
      }
    }
  }
  .planning-user {
    // width: 60% !important;
    .limit-text-placeholder {
      font-size: 12px;
    }
  }
}
@media all and (max-width: 520px) {
  .planning-user {
    width: 70% !important;
  }
}

@media all and (max-width: 400px) {
  .planning-user {
    width: 90% !important;
    .limit-text-placeholder {
      font-size: 12px;
    }
  }
}
</style>

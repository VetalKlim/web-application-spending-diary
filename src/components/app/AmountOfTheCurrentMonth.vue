<template>
  <div>
    <div class="btn-block-current-month">
      <span
        class="title-current"
        v-on:click.prevent="showCurrentMonth = !showCurrentMonth"
      >{{"planning_change_amount_for_current_month" | localize}}</span>
    </div>
    <form class="block-current" v-on:submit.prevent v-if="showCurrentMonth">
      <div class="input-field col s6">
        <input
          id="currentNowMonth"
          type="text"
          class="text-input"
          v-model.number="currentMony"
          v-bind:class="{invalid: ($v.currentMony.$dirty && !$v.currentMony.required) || ($v.currentMony.$dirty && !$v.currentMony.numeric) }"
        />
        <label
          class="limit-text-placeholder"
          for="currentNowMonth"
        >{{'planning_indicate_amount'| localize}}</label>
        <span
          v-if="($v.currentMony.$dirty && !$v.currentMony.required) || ($v.currentMony.$dirty && !$v.currentMony.numeric)"
          class="helper-text invalid"
        >{{'planning_you_did_not_specify_the_amount'|localize}}</span>
      </div>
      <span
        v-on:click.prevent="indicateTheAmountOfTheCurrentMonth"
        class="btn-currentNowMonth"
      >{{'planning_edit'|localize}}</span>
    </form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { required, numeric } from "vuelidate/lib/validators";
import localizeFilter from "@/filters/localize.filter.js";
import currencyFilter from "@/filters/currency.filter";
export default {
  data: () => ({
    currentMony: "",
    showCurrentMonth: false
  }),
  validations: {
    currentMony: {
      required,
      numeric
    }
  },
  methods: {
    async indicateTheAmountOfTheCurrentMonth() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        let current = this.currentMony;
        await this.$store.dispatch("updateInfo", { bill: current });
        this.$message(`${localizeFilter("planning_amount_for_current_month_changed")} ${currencyFilter(this.currentMony)}`
        );
        this.currentMony = "";
        this.showCurrentMonth = false;
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss">
.btn-block-current-month {
  .title-current {
    font-size: 15px;
    color: #26a69a;
    margin-bottom: 6px;
    display: inline-block;
    border: 1px solid;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
    &:hover{
      background-color: #26a69a;
      color: white;
      border-radius: 3px;
    }
  }
}
.block-current {
  width: 50%;

  .input-field {
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
  }
  .btn-currentNowMonth {
    padding: 5px 10px;
    color: #26a69a;
    border: 1px solid;
    cursor: pointer;
    &:hover {
      color: white;
      background: #26a69a;
    }
  }
}
@media all and (max-width: 520px) {
  .btn-block-current-month {
    .title-current {
      font-size: 12px !important;
      text-align: center;
    }
  }

  .block-current {
    width: 70%;
  }
}
@media all and (max-width: 400px) {
  .block-current {
    width: 90%;
  }
}
</style>

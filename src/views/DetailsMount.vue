<template>
  <div>
    <div class="breadcrumb-wrap bread-crumbs">
      <router-link v-tooltip="{html:'Назад в историю',position: 'right'}" to="/" class="breadcrumb">
        <i class="material-icons">keyboard_backspace</i>
        {{"menu_History"|localize}}
      </router-link>
      <a class="breadcrumb">{{this.$route.params.month}} / {{this.$route.params.year}}</a>
    </div>
    <LoaderLittle class="loader-history" v-if="loading" />
    <div v-else>
      <div class="block-graph">
        <div class="position-block-sum">
          <strong class="text-sum">
            {{'history_month_outcome'|localize}}:
            <span
              class="text-sum-number"
            >{{ sumOutcomeUser | currency}}</span>
          </strong>

          <strong class="text-sum">
            {{'history_month_income'|localize}}:
            <span
              class="text-sum-number"
            >{{ sumIncomeUser | currency}}</span>
          </strong>
        </div>

        <div class="block-graph-btn">
          <span
            class="btn-visualization-graph modal-trigger"
            href="#modal1"
          >{{"history_show graph"|localize}}</span>
          <hr class="hr-line" />

          <div id="modal1" ref="modalGraph" class="modal modalMonthDetail">
            <div class="modal-content">
              <canvas ref="canvas" />
            </div>
            <div class="modal-footer">
              <a href="#!" class="modal-close waves-effect waves-green btn-flat">
                <i class="large material-icons">cancel</i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="positions-table-detail-month">
        <table class="striped">
          <thead>
            <tr>
              <th>{{'date'| localize}}</th>
              <th>{{"history_amount"| localize}}</th>
              <th>{{"history_category"| localize}}</th>
              <th>{{"history_type"| localize}}</th>
              <th>{{"history_open"| localize}}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{record.fullDate }}</td>
              <td>{{record.amount | currency('UAH')}}</td>
              <td>{{record.nameCategory}}</td>
              <td>
                <span
                  class="white-text badge typeClassAmount"
                  :class="[record.type === 'outcome' ? 'red' : 'green']"
                >{{record.type === 'outcome'? `${ outcome }` : `${ income }`}}</span>
              </td>
              <td>
                <button
                  class="btn-small waves-effect btn"
                  v-on:click="$router.push('/Detail/' + record.id)"
                  v-tooltip="{html: `${detailRecord}`, position: 'left'}"
                >
                  <i class="material-icons small">open_in_new</i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { Line } from "vue-chartjs"; // импорт миксина
import localizeFilter from "@/filters/localize.filter.js";
export default {
  metaInfo() {
    return {
      title: this.$title("detail_mount")
    };
  },
  data: () => ({
    records: null,
    loading: true,
    sumOutcomeUser: "",
    sumIncomeUser: "",
    outcome: localizeFilter("history_outcome"),
    income: localizeFilter("history_income"),
    detailRecord: localizeFilter("history_detail_record")
  }),
  extends: Line,
  async mounted() {
    let records = await this.$store.dispatch("fetchRecords");
    let categories = await this.$store.dispatch("fetchCategories");

    let month = this.$route.params.month;
    let year = this.$route.params.year;
    this.loading = false;
    let rec = records.filter(function(c) {
      return c.dateMonth === month && c.dateYear === year;
    });

    this.records = rec.sort(function(a, b) {
      a = a.fullDate
        .split(".")
        .reverse()
        .join();
      b = b.fullDate
        .split(".")
        .reverse()
        .join();
      return a > b ? -1 : a < b ? 1 : 0;
    });

    this.sumOutcomeUser = this.records
      .filter(r => r.type === "outcome")
      .reduce((sum, r) => {
        return (sum += +r.amount);
      }, 0);
    this.sumIncomeUser = this.records
      .filter(r => r.type === "income")
      .reduce((sum, r) => {
        return (sum += +r.amount);
      }, 0);
    setTimeout(() => {
      M.Modal.init(this.$refs.modalGraph);
      this.renderChart({
        labels: categories.map(c => c.nameCategory),
        datasets: [
          {
            label: localizeFilter("history_costs_by_category"),
            data: categories.map(c => {
              return this.records.reduce((sum, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  sum += +r.amount;
                }
                return sum;
              }, 0);
            }),
            borderColor: ["red"],
            borderWidth: 1
          },
          {
            label: localizeFilter("history_revenues_by_category"),
            data: categories.map(c => {
              return this.records.reduce((sum, r) => {
                if (r.categoryId === c.id && r.type === "income") {
                  sum += +r.amount;
                }
                return sum;
              }, 0);
            }),
            borderColor: ["blue"],
            borderWidth: 1
          }
        ]
      });
    });
  },

  watch: {
    outcome() {
      return this.$store.getters.info.locale;
    },
    income() {
      return this.$store.getters.info.locale;
    },
    detailRecord() {
      return this.$store.getters.info.locale;
    }
  }
};
</script>
<style lang="scss">
.bread-crumbs {
  background: #f3f3f3;
  padding: 8px;
  border-radius: 3px;
}
.loader-history {
  display: flex;
  justify-content: flex-end;
  .preloader-wrapper {
    width: 18px;
    height: 18px;
  }
}
.block-graph {
  .block-graph-btn {
    display: flex;
    flex-direction: row-reverse;
    margin: 5px 0px !important;

    .btn-visualization-graph {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 2px;
      color: #26a69a;
      font-size: 14px;
      border: 1px solid #26a69a;
      &:hover {
        cursor: pointer;
        background: #26a69a;
        color: white;
        // box-shadow: 0 0 10px #26a69a;
      }
    }
  }
}
.positions-table-detail-month {
  height: 500px;
  margin-top: 10px;
  overflow-x: auto;
  .striped {
    .typeClassAmount {
      border-radius: 4px;
      width: 60%;
      color: white;
    }
  }
}

.position-block-sum {
  padding: 10px;
  .text-sum {
    color: #26a69a;
    font-style: italic;
    display: block;
    .text-sum-number {
      padding-left: 10px;
      border-bottom: 1px solid;
    }
  }
}
@media all and (max-width: 850px) {
  .striped {
    text-align: center !important;
    .typeClassAmount {
      width: auto !important;
    }
  }
  .modalMonthDetail.open {
    top: 0 !important ;
    max-height: 100vh !important;
    height: 100vh;
  }
}

@media all and (max-width: 450px) {
  .positions-table-detail-month {
    .striped {
      width: auto !important;
      margin: 0 auto !important;
      tr {
        td,
        th {
          padding: 2px !important;
          font-size: 13px;
        }
      }
    }
  }
}
</style>

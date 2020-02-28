<template>
  <div class="content-table">
    <div class="block-graph">
      <div class="block-graph-btn">
        <span
          class="btn-visualization-graph modal-trigger"
          href="#modal1"
        >{{'history_show graph'| localize}}</span>
        <hr class="hr-line" />
        <div id="modal1" ref="modalGraph" class="modal modalYear">
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
    <div class="position-table-block-mouth">
      <table class="table-history-month">
        <tbody>
          <table class="highlight table-t" v-for="list in infoYear" :key="list.year">
            <tr>
              <th colspan="2" class="title-mouth">{{list.year}}</th>
            </tr>
            <tr>
              <td class="td-income">{{'history_income'| localize}}</td>
              <td class="td-many">{{list.income | currency('UAH')}}</td>
            </tr>
            <tr>
              <td class="td-outcome">{{'history_outcome'| localize}}</td>
              <td class="td-many">{{list.outcome | currency('UAH')}}</td>
            </tr>
            <tr>
              <td></td>
              <td colspan="2" ref="youAreInTheRed" class="td-sum">
                {{'history_total'| localize}}:
                <span
                  :class="{'youAreInTheRed': list.income < list.outcome }"
                >({{list.income - list.outcome | currency('UAH')}})</span>
              </td>
            </tr>
          </table>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { Bar } from "vue-chartjs";
import localizeFilter from "@/filters/localize.filter.js";
export default {
  props: {
    records: {
      type: Array,
      required: true
    }
  },
  extends: Bar,
  data: () => ({
    infoYear: null
  }),
  mounted() {
    let arrYear = this.records.map(r => r.dateYear);
    let records = this.records;
    let yearCorrected = [...new Set(arrYear)];
    // console.log(arrYear);
    let dataInfoYear = [];
    for (let i = 0; i < yearCorrected.length; i++) {
      let el = yearCorrected[i].toString();
      records.forEach(function(item) {
        if (item.dateYear === el) {
          let income = records
            .filter(r => r.dateYear === el)
            .filter(r => r.type === "income")
            .reduce((sum, record) => {
              return (sum += +record.amount);
            }, 0);
          let outcome = records
            .filter(r => r.dateYear === el)
            .filter(r => r.type === "outcome")
            .reduce((sum, record) => {
              return (sum += +record.amount);
            }, 0);
          return dataInfoYear.push({
            year: el,
            income,
            outcome
          });
        }
      });
    }

    this.infoYear = Object.values(
      dataInfoYear.reduce(
        (acc, cur) => Object.assign(acc, { [cur.year]: cur }),
        {}
      )
    );
    M.Modal.init(this.$refs.modalGraph);
    this.renderChart({
      labels: this.infoYear.map(c => c.year),
      datasets: [
        {
          label: localizeFilter("history_outcome"),
          data: this.infoYear.map(c => c.outcome),

          backgroundColor: "#82669A",
          borderColor: "silver",
          borderWidth: 1
        },
        {
          label: localizeFilter("history_income"),
          data: this.infoYear.map(c => c.income),

          backgroundColor: "#669A8E",
          borderColor: "silver",
          borderWidth: 1
        }
      ]
    });
  }
};
</script>

<style lang="scss">
@media all and (max-width: 850px) {
  .modalYear.open {
    top: 0 !important ;
    max-height: 100vh !important;
    height: 100vh;
    .modal-content {
      padding-bottom: 0px;
    }
    .modal-footer {
      .modal-close {
        margin-top: 0px;
      }
    }
  }
}
</style>

<template>
  <div>
    <Loader v-if="loading" />
    <div v-else>
      <div class="input-field">
        <select ref="selectYear" v-model="selected">
          <option v-for="list of listYear" :key="list" :value="list" v-text="list">{{list}}</option>
        </select>
        <label>{{'history_choose year' | localize}}</label>
      </div>
      <span
        class="btn-visualization-mouth waves-effect"
        v-on:click="onYear"
      >{{"history_show"|localize}}</span>
      <div class="content-table" v-if="table">
        <div class="block-graph">
          <div class="block-graph-btn">
            <span
              class="btn-visualization-graph modal-trigger"
              href="#modal1"
            >{{'history_show_graph'| localize}}</span>
            <hr class="hr-line" />
            <div id="modal1" ref="modalGraph" class="modal modalMonth">
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
              <table class="highlight table-t" v-for="list of  listMonth" :key="list.id">
                <tr>
                  <th colspan="2" class="title-mouth">{{list.monthString}} {{selected}}</th>
                </tr>
                <tr>
                  <td class="td-income">{{'history_income' | localize}}</td>
                  <td class="td-many">{{list.income | currency('UAH')}}</td>
                </tr>
                <tr>
                  <td class="td-outcome">{{'history_outcome' | localize}}</td>
                  <td class="td-many">{{list.outcome | currency('UAH')}}</td>
                </tr>
                <tr>
                  <td>
                    <button
                      class="btn-small waves-effect btn"
                      v-on:click="$router.push('/DetailsMount/' + list.monthNumber +'/'+ selected)"
                      v-tooltip="{html: `${list.text} ${list.monthString.toLowerCase()}`, position: 'right'}"
                    >
                      <i class="material-icons">open_in_new</i>
                    </button>
                  </td>
                  <td colspan="2" ref="youAreInTheRed" class="td-sum">
                    {{'history_total' | localize}}:
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
    </div>
  </div>
</template>
<script>
import { Line } from "vue-chartjs";
import localizeFilter from "@/filters/localize.filter.js";
export default {
  name: "historyMonth",
  props: {
    records: Array,
    required: true
  },
  extends: Line,
  data: () => ({
    loading: true,
    table: false,
    select: null,
    selected: null,
    listYear: null,
    listMonth: null
  }),
  mounted() {
    if (this.records.length === 0) {
      this.loading = true;
    }

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.selectYear);
    }, 0);
    function remove_duplicates(arr) {
      let s = new Set(arr);
      let it = s.values();
      return Array.from(it);
    }
    let recordDateYear = this.records.map(item => item.dateYear);
    this.listYear = remove_duplicates(recordDateYear);

    this.selected = this.listYear[0];
    this.loading = false;
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    onYear() {
      this.table = true;
      let yearSelectUser = this.selected;
      let typeDateYear = this.records.filter(function(el) {
        return el.dateYear === yearSelectUser;
      });

      let month = [];
      typeDateYear.forEach(el => {
        month.push(el.dateMonth);
      });
      let monthCorrected = [...new Set(month)];
      let MonthlyHistoryData = [];

      for (let i = 0; i < monthCorrected.length; i++) {
        const el = monthCorrected[i].toString();
        typeDateYear.forEach(function(item) {
          if (item.dateMonth === el) {
            let outcome = typeDateYear
              .filter(r => r.dateYear === yearSelectUser)
              .filter(r => r.dateMonth === el)
              .filter(r => r.type === "outcome")
              .reduce((sum, record) => {
                return (sum += +record.amount);
              }, 0);
            let income = typeDateYear
              .filter(r => r.dateYear === yearSelectUser)
              .filter(r => r.dateMonth === el)
              .filter(r => r.type === "income")
              .reduce((sum, record) => {
                return (sum += +record.amount);
              }, 0);

            switch (el) {
              case "01":
                el = localizeFilter("history_January");
                month = "01";
                break;
              case "02":
                el = localizeFilter("history_February");
                month = "02";
                break;
              case "03":
                el = localizeFilter("history_March");
                month = "03";
                break;
              case "04":
                el = localizeFilter("history_April");
                month = "04";
                break;
              case "05":
                el = localizeFilter("history_May");
                month = "05";
                break;
              case "06":
                el = localizeFilter("history_June");
                month = "06";
                break;
              case "07":
                el = localizeFilter("history_July");
                month = "07";
                break;
              case "08":
                el = localizeFilter("history_August");
                month = "08";
                break;
              case "09":
                el = localizeFilter("history_September");
                month = "09";
                break;
              case "10":
                el = localizeFilter("history_October");
                month = "10";
                break;
              case "11":
                el = localizeFilter("history_November");
                month = "11";
                break;
              case "12":
                el = localizeFilter("history_December");
                month = "12";
                break;
              default:
            }
            return MonthlyHistoryData.push({
              monthString: el,
              monthNumber: month,
              outcome,
              income,
              text: localizeFilter("history_detail")
            });
          }
        });
      }

      let bb = Object.values(
        MonthlyHistoryData.reduce(
          (acc, cur) => Object.assign(acc, { [cur.monthNumber]: cur }),
          {}
        )
      );
      this.listMonth = bb.sort(function(a, b) {
        a = a.monthNumber;
        b = b.monthNumber;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      setTimeout(() => {
        M.Modal.init(this.$refs.modalGraph);
        this.renderChart({
          labels: this.listMonth.map(c => c.monthString),
          datasets: [
            {
              label: localizeFilter("history_costs_by_category"),
              data: this.listMonth.map(c => c.outcome),
              backgroundColor: ["rgba(188, 20, 86, 0.2)"],
              borderColor: ["red"],
              borderWidth: 1
            },
            {
              label: localizeFilter("history_revenues_by_category"),
              data: this.listMonth.map(c => c.income),
              backgroundColor: ["rgba(154, 162, 235, 0.7)"],
              borderColor: ["blue"],
              borderWidth: 1
            }
          ]
        });
      }, 0);
    }
  }
};
</script>
<style lang="scss">
.select-dropdown {
  color: #26a69a;
}
.btn-visualization-mouth {
  padding: 5px 10px;
  border: 1px solid;
  display: inline-block;
  color: #26a69a;
  border-radius: 2px;
  &:hover {
    background: #26a69a;
    color: white;
    cursor: pointer;
  }
}
.content-table {
  display: flex;
  flex-direction: column;
  .position-table-block-mouth {
    margin-top: 20px;
    max-height: 400px;
    height: 400px;
    overflow-y: auto;

    .table-history-month {
      margin-top: 10px;
      .table-t {
        // border-top: 1px solid black;
        // border-bottom: 2px solid #26A69A;
        color: #16625a;

        tr {
          .title-mouth {
            text-align: center;
            font-weight: bold;
            text-align: center;
            font-weight: bold;
            padding: 10px;
            background: #d8d8d8;
            color: #414141;
            border-radius: 1px;
            box-shadow: 0 2px 3px #d3d3d3;
            border-bottom: 2px solid #26a69a;
          }
        }
        tr {
          .td-income,
          .td-outcome {
            text-align: left;
            padding: 5px 10px;
          }
          .td-many {
            text-align: right;
            padding: 5px 10px;
          }
        }
        tr {
          .td-sum {
            text-align: right;
            padding: 5px 10px;
            .youAreInTheRed {
              color: red;
            }
          }
        }
      }
    }
  }
}
@media all and (max-width: 850px) {
  .position-table-block-mouth {
    margin-top: 0px !important;
    max-height: 200px !important;
    height: 200px !important;
  }
  .modalMonth.open {
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

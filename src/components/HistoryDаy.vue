<template>
  <div>
    <div class="block-graph">
      <div class="block-graph-btn">
        <span
          class="btn-visualization-graph waves-effect modal-trigger"
          href="#modalGraph"
        >{{'history_show graph'| localize}}</span>
        <hr class="hr-line" />
        <div id="modalGraph" ref="modalGraph" class="modal modalDay">
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
        <tr v-for="record in items" :key="record.id">
          <td>{{record.fullDate }}</td>
          <td>{{record.amount |currency('UAH')}}</td>
          <td>{{record.categoryName}}</td>
          <td>
            <span
              class="white-text badge typeClassAmount"
              :class="[record.typeClass]"
            >{{record.typeText}}</span>
          </td>
          <td>
            <button
              class="btn-small waves-effect btn"
              v-on:click="$router.push('/detail/' + record.id)"
            >
              <i class="material-icons">open_in_new</i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Paginate
      v-model="page"
      :page-count="pageCount"
      :click-handler="pageChangeHandler"
      :prev-text="'history_prev' | localize"
      :next-text="'history_next' | localize"
      :container-class="'pagination center-align'"
      :page-class="'waves-effect'"
    ></Paginate>
  </div>
</template>
<script>
import localizeFilter from "@/filters/localize.filter.js";
import paginationMixin from "@/mixins/pagination.mixins.js"; // импорт миксина
import { Line } from "vue-chartjs";
export default {
  props: {
    records: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },

  mixins: [paginationMixin],
  data: () => ({
    onGraph: false
  }),
  extends: Line,
  mounted() {
    this.setupPagination(
      this.records.sort(function(a, b) {
        a = a.fullDate
          .split(".")
          .reverse()
          .join();
        b = b.fullDate
          .split(".")
          .reverse()
          .join();
        return a > b ? -1 : a < b ? 1 : 0;
      })
    ),
      this.setup(this.categories, this.records);

    M.Modal.init(this.$refs.modalGraph);
  },
  computed: {
    localize() {
      return this.$store.getters.info.locale;
    }
  },
  methods: {
    setup(categories, records) {
      let costs = localizeFilter("history_costs_by_category");
      let revenues = localizeFilter("history_revenues_by_category");
      this.renderChart({
        labels: categories.map(c => c.nameCategory),
        datasets: [
          {
            label: costs,
            data: categories.map(c => {
              return records.reduce((sum, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  sum += +r.amount;
                }
                return sum;
                s;
              }, 0);
            }),
            backgroundColor: ["rgba(75, 192, 192, 0.2)"],
            borderColor: ["red"],
            borderWidth: 1
          },
          {
            label: revenues,
            data: categories.map(c => {
              return records.reduce((sum, r) => {
                if (r.categoryId === c.id && r.type === "income") {
                  sum += +r.amount;
                }
                return sum;
              }, 0);
            }),
            backgroundColor: ["rgba(75, 192, 192, 0.2)"],
            borderColor: ["blue"],
            borderWidth: 1
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss">
.block-graph {
  .block-graph-btn {
    display: flex;
    flex-direction: row-reverse;
    margin: 10px;

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
table {
  tr {
    td {
      .typeClassAmount {
        border-radius: 4px;
        width: 60%;
        // line-height: 2px;
      }
    }
  }
}
.pagination {
  li.active {
    background-color: #26a69a;
  }
  li {
    a {
      color: #26a69a;
      outline: none !important;
      &:hover {
        background: #26a69a;
        color: white;
        border-radius: 5px;
      }
    }
  }
  .disabled {
    a {
      color: white !important;
      background: #94a6a4;
      border-radius: 5px;
    }
  }
}
@media all and (max-width: 850px) {
  .positions-table {
    .table-block-history {
      .btn-history {
        .icon-list-history {
          margin: 0 !important;
        }
      }
      .block-graph {
        .block-graph-btn {
          margin: 0;
        }
      }
      .striped {
        text-align: center !important;
        .typeClassAmount {
          width: auto !important;
        }
      }
    }
  }
  .modalDay.open {
    top: 0 !important ;
    max-height: 100vh !important;
    height: 100vh;
    .modal-content {
      padding-bottom: 0px;
      .title-modal-text-delete {
        font-size: 16px;
        margin: 50% auto 20px auto;
        border-bottom: 1px solid;
        padding-bottom: 10px;
        color: #1c7d73;
        font-style: italic;
      }
    }
    .modal-footer {
      .modal-close {
        margin-top: 0px;
      }
    }
  }
}

@media all and (max-width: 450px) {
  .positions-table {
    .table-block-history {
      .block-graph {
        .block-graph-btn {
          margin-bottom: 10px !important;
        }
      }
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
}
</style>

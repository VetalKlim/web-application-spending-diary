<template>
  <div>
    <div class="page-title page-title-history">
      <h3 class="title-text-history">{{'history_history records' | localize}}</h3>
    </div>
    <loader v-if="loading"/>
    <p class="center" v-else-if="records.length === 0">
      <span
        class="center text-category-no"
      >{{'history_There are no records in history' | localize }}</span>
    </p>
    <section class="positions-table" v-else>
      <HistoryTable v-bind:records="records" v-bind:categories="categories" :key="localize" />
    </section>
  </div>
</template>
<script>
import localizeFilter from "@/filters/localize.filter.js";
import HistoryTable from "@/components/HistoryTable.vue";

export default {
   metaInfo() {
    return {
      title: this.$title('history') 
    };
  },
  name: "history",
  data: () => ({
    loading: true,
    records: [],
    categories: [],
    allRecords: []
  }),
  async mounted() {
    this.allRecords = await this.$store.dispatch("fetchRecords");
    this.categories = await this.$store.dispatch("fetchCategories");
    this.records = this.allRecords.map(record => {
      return {
        ...record,
        categoryName: this.categories.find(c => c.id === record.categoryId)
          .nameCategory,
        typeClass: record.type === "income" ? "green" : "red",
        typeText:
          record.type === "income"
            ? localizeFilter("history_income")
            : localizeFilter("history_outcome")
      };
    });

    this.loading = false;
  },
  computed: {
    localize() {
      return this.$store.getters.info.locale;
    }
  },

  components: {
    HistoryTable
  }
};
</script>
<style lang="scss">
.page-title-history {
  margin-bottom: 0px; 
  border: none !important; 
}
.title-text-history {
  margin: 0;
  font-size: 1.5rem !important;
  color: #144d56;
  font-style: italic;
 
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
@media all and (max-width: 850px) {
  .page-title-history {
    .title-text-history {
      font-size: 16px !important;
    }
  }
  .positions-table {
    .table-block-history {
      .btn-history {
        .icon-list-history {
          margin: 0 !important;
        }
      }.block-graph{
        .block-graph-btn{
          margin: 0;
        }
      }
    }
  }
}
@media all and (max-width: 450px) {
  .positions-table {
    .table-block-history {
     .striped{
        width: auto !important;
        margin: 0 auto !important;
      }
    }
  }
}
</style>

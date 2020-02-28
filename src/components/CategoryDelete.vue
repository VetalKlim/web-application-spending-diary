<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4 class="categoty-text">{{'category_delete_category'|localize}}</h4>
      </div>

      <div
        class="no-categories"
        v-if="statusCategory"
      >{{'category_no_categories_to_delete'| localize}}</div>

      <form v-else>
        <div class="input-field">
          <select ref="select" v-model="current">
            <option
              v-for="list of listOfCategories"
              :key="list.id"
              :value="list.id"
            >{{list.nameCategory}}</option>
          </select>
        </div>

        <div class="waves-effect waves-light btn modal-trigger" href="#modal1">
          {{'history_delete'|localize}}
          <i class="material-icons right">delete</i>
        </div>
      </form>
    </div>

    <!-- Modal Structure -->
    <div id="modal1" ref="modalDelete" class="modal modalDelete">
      <div class="modal-content">
        <p class="text-warning">{{'history_detail_warning'| localize}}</p>
        <p class="text-warning">{{'history_detail_warning_2'| localize}}</p>
      </div>
      <div class="modal-footer block-btn">
        <span
          class="modal-close waves-effect btn-delete"
          v-on:click.prevent="deleteCategory"
        >{{'history_delete'| localize}}</span>
        <span class="modal-close waves-effect btn-delete">{{'exit'| localize}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listOfCategories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    statusCategory: false,
    select: null,
    current: null,
    nameCategoryNow: null
  }),

  async created() {
    if (this.listOfCategories.length === 0) {
      this.statusCategory = true;
    } else if (this.listOfCategories.length > 0) {
      this.statusCategory = false;
      let { id, nameCategory } = this.listOfCategories[0];
      this.current = id;
      this.nameCategoryNow = nameCategory;
    }
  },
  async mounted() {
    M.Modal.init(this.$refs.modalDelete);
    this.select = M.FormSelect.init(this.$refs.select);
    M.updateTextFields();
    let records = await this.$store.dispatch("fetchRecords");
  },
  destroyed() {
    if (this.select && this.select.destroyed) {
      this.select.destroyed();
    }
  },
  methods: {
    async deleteCategory() {
      try {
        let categoryData = {
          id: this.current
        };
        let idCategory = {
          categoryId: this.current
        };
        await this.$store.dispatch("deleteCategory", categoryData);
        let records = await this.$store.dispatch("fetchRecords");
        let categories = await this.$store.dispatch("fetchCategories");
        if (categories.length === 0) {
          await this.$store.dispatch("updateInfo", {
            bill: 0
          });
        }
        let newRecords = records.filter(
          item => item.categoryId !== this.current
        );
        await this.$store.dispatch("deleteRecordByCategory", newRecords);
        this.$message(`Категория была удалена`);
        this.$emit("update", categoryData);
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss">
.text-warning {
  text-align: center;
  color: red;
}
.input-field {
  .select-wrapper {
    .select-dropdown {
      max-height: 300px !important;
      color: #26a69a;
    }
  }
  .text-help {
    color: silver;
  }
}
.block-btn {
  display: flex;
  justify-content: space-around;
  height: auto !important;
  padding: 10px;
  .btn-delete {
    color: #26a69a;
    cursor: pointer;
    margin-bottom: 10px;
    padding: 3px 10px;
    border: 1px solid;
    border-radius: 2px;
    &:hover {
      background: #1c7d73;
      color: white;
    }
  }
}
@media all and (max-width: 850px) {
  .modalDelete.open {
    top: 50px !important;
    // max-height: 38vh !important;
    height: auto !important;
    .modal-content {
      padding: 20px 10px 10px 10px;
      .title-modal-text-delete {
        font-size: 16px;
        margin: 50% auto 20px auto;
        border-bottom: 1px solid;
        padding-bottom: 10px;
        color: #1c7d73;
        font-style: italic;
      }
    }
  }
}
</style>


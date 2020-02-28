<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4 class="categoty-text">{{'category_edit_category'|localize}}</h4>
      </div>
      <div class="no-categories" v-if="statusCategory">{{'category_no_categories_to_edit'|localize}}</div>
      <form v-else v-on:submit.prevent="onSubmit">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option
              v-for="sel of listOfCategories"
              :key="sel.id"
              :value="sel.id"
            >{{ sel.nameCategory }}</option>
          </select>
        </div>

        <div class="input-field">
          <input
            type="text"
            id="name"
            class="text-input"
            v-model.trim="categoryName"
            v-bind:class="{invalid: $v.categoryName.$dirty && !$v.categoryName.required}"
          />
          <label for="name">{{'category_name_categoty'|localize}}</label>
          <span
            class="helper text-help"
            v-if="$v.categoryName.required"
          >{{'category_edit'| localize}}</span>
          <span
            class="helper-text invalid"
            v-else
          >{{'category_the_field_must_not_be_empty'|localize}}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'category_edit'| localize}}
          <i class="material-icons right">mode_edit</i>
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import localizeFilter from "@/filters/localize.filter.js";
export default {
  props: {
    listOfCategories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: false, // переменная которая хранит активность инициализации плагина на определенном теге html
    categoryName: "", // переменная которая связывает input
    current: null, // переменная которая хранит первую категорию чтобы показывать её в списке
    statusCategory: false // переменная для скрытия формы если нет категорий для редактирования
  }),

  created() {
    if (this.listOfCategories.length === 0) {
      this.statusCategory = true;
    } else {
      this.statusCategory = false;
      const { id, nameCategory } = this.listOfCategories[0];
      this.current = id;
      this.categoryName = nameCategory;
    }
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select);

    M.updateTextFields();
  },
  watch: {
    current(categoryId) {
      const { nameCategory } = this.listOfCategories.find(
        c => c.id === categoryId
      );
      this.categoryName = nameCategory;
    }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  validations: {
    categoryName: {
      required
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$v.categoryName.required) {
        this.$v.$touch();
        return;
      }
      let listCategoty = await this.$store.dispatch("fetchCategories");
      if (
        listCategoty.find(
          x => x.nameCategory.toLowerCase() === this.categoryName.toLowerCase()
        )
      ) {
        this.$message(
          `${localizeFilter(
            "category_this_category_has_already_been_created"
          )}  ${this.categoryName}`
        );
        return;
      }

      try {
        const categoryData = {
          id: this.current,
          nameCategory: this.categoryName
        };
        await this.$store.dispatch("updateCategory", categoryData);

        let records = await this.$store.dispatch("fetchRecords");
        let editRecords = [];
        records.forEach(element => {
          if (element.categoryId === this.current) {
            editRecords.push({
              ...element,
              nameCategory: this.categoryName
            });
          } else {
            editRecords.push(element);
          }
        });
        await this.$store.dispatch("updateRecords", editRecords);
        this.$message("Категория успешно обновлена ");
        this.$emit("update", categoryData);
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss">
.no-categories {
  text-align: left;
  font-size: 17px;
  font-style: italic;
  color: #26a69a;
  font-weight: bold;
  padding: 20px 20px 20px 10px;
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
</style>

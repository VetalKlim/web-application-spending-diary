<template>
  <div>
    <div class="page-title">
      <h3 class="title-text-record">{{'category_categories'|localize}}</h3>
    </div>
    <div class="position-btn">
      <div
        class="btn waves-effect"
        v-on:click="closeCategoryCreate()"
      >{{'categoty_create_category'|localize}}</div>
      <div
        class="btn waves-effect"
        v-on:click="closeCategoryEdit()"
      >{{'category_edit_category'| localize}}</div>
      <div
        class="btn waves-effect"
        v-on:click="closeCategoryDelete()"
      >{{'category_delete_category'|localize}}</div>
    </div>
    <section class="position-categories">
      <div class="row">
        <transition name="animateCategory">
          <CategoryCreate v-if="openCategoryCreate" v-on:created="addNewCategory" />
          <!--  -->
          <CategoryEdit
            v-on:update="updateCategory"
            v-bind:key="categories.length + updateCount"
            v-if="openCategoryEdit"
            v-bind:listOfCategories="categories"
          />
          <CategoryDelete
            v-on:update="deleteCategory"
            v-bind:key="categories.length + updateCount"
            v-bind:listOfCategories="categories"
            v-if="openCategoryDelete"
          />
        </transition>
      </div>
    </section>
  </div>
</template>
<script>
import CategoryCreate from "@/components/CategoryCreate.vue";
import CategoryEdit from "@/components/CategoryEdit.vue";
import CategoryDelete from "@/components/CategoryDelete.vue";
export default {
  metaInfo() {
    return {
      title: this.$title("categories")
    };
  },
  name: "categories",
  data: () => ({
    openCategoryCreate: false,
    openCategoryEdit: false,
    openCategoryDelete: false,
    categories: [], // создаем переменную в которой будут хранится категории прилетевшие от компонента CategoryCreate
    updateCount: 0 // переменная для того чтобы обновлялись данные реактивно
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories"); // используем метод fetchCategories которой лежит в файле Store/categories
  },
  methods: {
    closeCategoryCreate() {
      this.openCategoryCreate = true;
      this.openCategoryEdit = false;
      this.openCategoryDelete = false;
    },
    closeCategoryEdit() {
      this.openCategoryCreate = false;
      this.openCategoryEdit = true;
      this.openCategoryDelete = false;
    },
    closeCategoryDelete() {
      this.openCategoryCreate = false;
      this.openCategoryEdit = false;
      this.openCategoryDelete = true;
    },
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategory(updateCategory) {
      const idx = this.categories.findIndex(c => c.id === updateCategory.id);

      this.categories[idx].nameCategory = updateCategory.nameCategory;
      this.updateCount++;
    },
    deleteCategory(idCategoryDelete) {
      const idx = this.categories.findIndex(c => c.id === idCategoryDelete.id);

      this.categories.splice(idx, 1);
      this.updateCount;
    }
  },

  components: {
    CategoryCreate,
    CategoryEdit,
    CategoryDelete
  }
};
</script>
<style lang="scss">
.page-title {
  .title-text-record {
    margin: 0;
    font-size: 1.8rem;
    color: #144d56;
    font-style: italic;
  }
}
.position-btn {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.position-categories {
  margin: 20px 20px 20px 0px;
  padding: 20px 20px 20px 0px;
}
.animateCategory-enter {
  opacity: 0;
}
.animateCategory-enter-active {
  transition: ease-in 0.3s;
}
.animateCategory-leave-active {
  opacity: 1;
}
.animateCategory-leave-to {
  transition: 0s;
}
</style>

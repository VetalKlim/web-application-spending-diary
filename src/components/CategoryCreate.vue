<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4 class="categoty-text">{{'categoty_create_category'|localize}}</h4>
      </div>

      <form v-on:submit.prevent="onSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            class="text-input"
            v-model.lazy.trim="nameCategory"
            v-bind:class="{invalid: $v.nameCategory.$dirty && !$v.nameCategory.required}"
          />
          <label for="name">{{'category_name_categoty'|localize}}</label>

          <span
            class="helper-text invalid"
            v-if="$v.nameCategory.$dirty && !$v.nameCategory.required"
          >{{'category_enter_a_category_name'|localize}}</span>
          <span class="helper-text" v-else>{{'category_name_categoty'|localize}}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'record_create'|localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import localizeFilter from "@/filters/localize.filter.js";
export default {
  data: () => ({
    nameCategory: ""
  }),
  validations: {
    nameCategory: {
      required
    }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch(); 
        return; 
      }
      let listCategoty = await this.$store.dispatch("fetchCategories"); 
      if (
        listCategoty.find(
          x => x.nameCategory.toLowerCase() === this.nameCategory.toLowerCase()
        )
      ) {
        this.$message(
          `${localizeFilter(
            "category_this_category_has_already_been_created"
          )}  ${this.nameCategory}`
        ); 
        return;
      }
      try {
      
        const category = await this.$store.dispatch("createCategory", {
        
          nameCategory: this.nameCategory
        });
      
        this.$message(`Категория была ${this.nameCategory} создана `); 
        this.nameCategory = ""; 
        this.$v.$reset(); 
        this.$emit("created", category);
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss">
.categoty-text {
  margin: 0;
  font-size: 18px !important;
  color: #144d56;
  font-style: italic;
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
.text-input {
  color: #26a69a;
}
</style>

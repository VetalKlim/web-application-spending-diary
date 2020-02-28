<template>
  <form class="card auth-card" v-on:submit.prevent="onSubmit">
  
    <div class="card-content">
      <span class="card-title text-title-application">Ежедневные расходы</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          v-bind:class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
        />

        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="$v.email.$dirty && !$v.email.required"
        >Поле Email не должно быть пустым</small>
      
        <small
          class="helper-text invalid"
          v-else-if="$v.email.$dirty && !$v.email.email"
        >Введите корректный Email</small>
       
      </div>
      <div class="input-field">
        <i
          class="material-icons showPas"
          v-on:click.prevent="showPas = !showPas"
        >{{showPas === false ? "visibility_off" : "remove_red_eye"}}</i>
        <input
          id="password"
          type="password"
          v-model.trim="password"
          v-bind:class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
          v-show="!showPas"
        />
        <input
          type="text"
          v-model.trim="password"
          v-bind:class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
          v-show="showPas"
        />
     
        <label class="label-text" for="password">Пароль</label>

        <small
          class="helper-text invalid"
          v-if="$v.password.$dirty && !$v.password.required"
        >Поле Password не должно быть пустым</small>
        <small
          class="helper-text invalid"
          v-else-if="$v.password.$dirty && !$v.password.minLength"
        >Password не меньше {{$v.password.$params.minLength.min}} символов сейчас введено {{ password.length }}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
          v-on:click="onLoader()"
        >
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>
      <LoaderLine v-if="loader" />

      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>
<script>
import LoaderLine from "@/components/app/LoaderLine.vue";

import { email, required, minLength } from "vuelidate/lib/validators";

import messages from "@/utils/messages";
export default {
  metaInfo() {
    return {
      title: this.$title("login")
    };
  },
  name: "login",

  data: () => ({
    email: "",
    password: "",
    loader: false,
    showPas: false,
    forgotPassword: false
  }),

  validations: {
    email: {
      email,
      required
    },
    password: {
      required,
      minLength: minLength(6)
    }
  },

  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message]);
    }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      // создаем объект для передачи его
      const formData = {
        email: this.email,
        password: this.password
      };

      try {
        await this.$store.dispatch("login", formData);
        this.loader = false;

        this.$router.push("/");
      } catch (e) {}
    },
    onLoader() {
      if (!this.$v.$invalid) {
        this.loader = true;
      }
    }
  },
  components: {
    LoaderLine
  }
};
</script>
<style lang="scss">
.card-content {
  .text-title-application {
    margin: 0;
    font-size: 19px !important;
    color: #144d56;
    font-style: italic;
    font-weight: bold;
  }
}
.showPas {
  cursor: pointer;
  float: right;
  font-size: 19px;
  color: #26a69a;
  position: relative;
  top: 20px;
}
.label-text {
  top: 16px !important;
}
@media all and (max-width: 850px) {
  .auth-card {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
  }
}
</style>


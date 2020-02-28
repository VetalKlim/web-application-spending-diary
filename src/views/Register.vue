<template>
  <form class="card auth-card auth-card-register" v-on:submit.prevent="onSubmit">
    <!-- вешаем на форму прослушку события и отменяем стандартные поведение с помощью модификатора prevent (по стандарту submit перегружает страницу)   -->
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
          v-on:click.prevent="showPass = !showPass"
        >{{showPass === false ? "visibility_off" : "remove_red_eye"}}</i>
        <input
          id="password"
          type="password"
          v-model.trim="$v.password.$model"
          v-bind:class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
          v-show="!showPass"
        />
        <input
          type="text"
          v-model.trim="$v.password.$model"
          v-bind:class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
          v-show="showPass"
        />

        <label class="label-text" for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="$v.password.$dirty && !$v.password.required"
        >Поле не должно быть пустым</small>
        <small
          class="helper-text invalid"
          v-else-if="$v.password.$dirty && !$v.password.minLength"
        >Password не меньше {{$v.password.$params.minLength.min}} символов сейчас введено {{ password.length }}</small>
      </div>

      <div class="input-field">
        <i
          class="material-icons showPas"
          v-on:click.prevent="showPass2 = !showPass2"
        >{{showPass2 === false ? "visibility_off" : "remove_red_eye"}}</i>
        <input
          id="repeatPassword"
          type="password"
          v-model.trim="$v.repeatPassword.$model"
          v-bind:class="{invalid:($v.repeatPassword.$dirty && !$v.repeatPassword.required) || (!$v.repeatPassword.sameAsPassword)}"
          v-show="!showPass2"
        />

        <input
          type="text"
          v-model.trim="$v.repeatPassword.$model"
          v-bind:class="{invalid:($v.repeatPassword.$dirty && !$v.repeatPassword.required) || (!$v.repeatPassword.sameAsPassword)}"
          v-show="showPass2"
        />
        <label class="label-text" for="repeatPassword">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="!$v.repeatPassword.sameAsPassword"
        >Пароли не совпадают</small>
        <small
          class="helper-text invalid"
          v-else-if="$v.repeatPassword.$dirty && !$v.repeatPassword. required"
        >Поле не должно быть пустым</small>
      </div>

      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="name"
          v-bind:class="{invalid:($v.name.$dirty && !$v.name.required)}"
        />
        <label for="name">Имя</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >Вы не ввели имя</small>
      </div>

      <span class="checkedNoError" v-if="agree">ОК</span>
      <span class="checkedYesError" v-else-if="!agree">Поставь галочку</span>
      <dir class="cc">
        <label>
          <input type="checkbox" v-model="agree" />
          <span class="span-text">С правилами согласен</span>
        </label>
        <div class="block-rule" v-on:click.prevent="clickRule = !clickRule">
          <span class="rule">Ознакомиться с правилами</span>
        </div>
      </dir>
      <transition name="animateRule">
        <div class="text-rule" v-if="clickRule">
          <p class="text">У нас правила это никаких правил!</p>
        </div>
      </transition>
    </div>

    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
          v-on:click="onLoader()"
        >
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
        <LoaderLine v-if="loader" />
      </div>
      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import LoaderLine from "@/components/app/LoaderLine.vue";

import { email, required, sameAs, minLength } from "vuelidate/lib/validators";

export default {
  metaInfo() {
    return {
      title: this.$title("register")
    };
  },
  name: "register", // имя страницы

  data: () => ({
    email: "",
    password: "",
    repeatPassword: "",
    name: "",
    clickRule: false,
    agree: false,
    loader: false,
    showPass: false,
    showPass2: false
  }),

  validations: {
    email: {
      email, // поле принимает  email
      required // означает что пустое поле не принимается
    },
    password: {
      required, // означает что пустое поле не принимается
      minLength: minLength(6) // означает что минимум должно быть 6 знаков в пароле
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs("password")
    },
    name: {
      required
    },
    agree: {
      checked: sameAs(() => true)
    }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      // создаем объект для передачи
      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      };
      try {
    
        await this.$store.dispatch("register", formData);
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
.checkedNoError {
  color: #26a69a;
  transition: ease-out 0.5s;
  font-style: italic;
  font-weight: bold;
}
.checkedYesError {
  font-style: italic;

  color: red;
  transition: ease-in 0.5s;
}
.cc {
  display: flex;
  justify-content: space-between;
  padding: 2px;
  .span-text {
    margin-top: 8px;
  }
  .block-rule {
    padding: 5px 6px;
    line-height: 2;
    border: 1px solid #26a69a;
    border-radius: 2px;
    .rule {
      font-size: 14px;
      color: #26a69a;
    }
    &:hover {
      background: #26a69a;
      cursor: pointer;
      .rule {
        color: white;
      }
    }
  }
}
.text-rule {
  border: 1px solid #9e9eb7;
  padding: 10px;
  border-radius: 2px;
  .text {
    color: #9e9eb7;
    text-align: justify;
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
.animateRule-enter {
  opacity: 0;
}
.animateRule-enter-active {
  transition: all 1s;
}
.animateRule-leave-active {
  // animation: 0.5s animateRule-slide forwards;
  // transition:  opacity 0.5s;
  opacity: 0;
}
.animateRule-leave-to {
  // opacity: 0;
  transition: all 0.3s;
}
@media all and (max-width: 850px) {
  .empty-layout {
    padding-top: 0;
    .auth-card-register {
      // margin: -20% auto !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .block-rule {
        line-height: 1 !important;
        text-align: center;
        padding: 12px 6px;
        .rule {
          font-size: 12px;
        }
      }
    }
  }
}
</style>

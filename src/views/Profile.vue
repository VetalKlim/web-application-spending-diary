<template>
  <div>
    <div class="page-title">
      <h3 class="title-text-profile">{{'ProfileTitle'| localize }}</h3>
      <small class="profile-name">{{name}}</small>
    </div>

    <form class="form" v-on:submit.prevent="nameChange">
      <div class="input-field">
        <input
          class="text-name"
          id="description"
          type="text"
          v-model.trim="name"
          v-bind:class="{invalid:($v.name.$dirty && !$v.name.required)}"
        />
        <label for="description">{{'Username' | localize}}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >{{'didNotName' | localize}}</small>
      </div>
      <button class="btn waves-effect waves-light" type="submit">
        {{'refresh'| localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
    <div class="change-password">
      <h5
        class="titleChange"
        v-on:click.prevent="showChangePassword = !showChangePassword"
      >{{'change_Password'| localize}}</h5>
      <div class="content-change-password" v-show="showChangePassword">
        <p class="text-change-password">{{'change_your_password'| localize}}</p>
        <div class="input-field">
          <input
            class="text-name"
            id="email"
            type="email"
            v-model.trim="email"
            v-bind:class="{invalid:($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && $v.email.email)}"
          />
          <label for="email">Email</label>
          <small
            class="helper-text invalid"
            v-if="$v.email.$dirty && !$v.email.required"
          >{{'You_have_not_entered_Email'| localize}}</small>
        </div>
        <button class="btn" v-on:click.prevent="changePassword">{{'change_Password' |localize}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import firebase from "firebase/app";
import localizeFilter from "@/filters/localize.filter.js";
export default {
  metaInfo() {
    return {
      title: this.$title("profile")
    };
  },
  name: "profile",
  data: () => ({
    name: "",
    email: "",
    showChangePassword: false
  }),
  mounted() {
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
    this.email = firebase.auth().currentUser.email;

    this.name = this.info.name;
  },
  validations: {
    name: {
      required
    },
    email: {
      required,
      email
    }
  },

  computed: {
    ...mapGetters(["info"])
  },
  methods: {
    ...mapActions(["updateInfo"]), // вызываем карту mapActions и метод который обновляет БД
    async nameChange() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.updateInfo({
          // используем метод updateInfo и передаем для обновления новое имя
          name: this.name
        });

        this.$message("Имя пользователя успешно изменено");
      } catch (error) {}
    },
    changePassword() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.$store.dispatch("changePasswordUser");
      this.$message(
        `Вам отправлено письмо ${this.email} с ссылкой на изменения пароля`
      );
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="scss">
.title-text-profile {
  margin: 0;
  font-size: 22px !important;
  color: #144d56;
  font-style: italic;
}
.profile-name {
  font-size: 14px;
  color: #26a69a;
  border-bottom: 1px solid;
  font-style: italic;
}
.text-name {
  color: darkcyan;
}
.change-password {
  .titleChange {
    cursor: pointer;
    background-color: white;
    display: inline-block;
    padding: 6px 15px;
    font-size: 16px;
    color: #26a69a;
    border-radius: 2px;
    border: 1px solid;
    &:hover {
      background-color: #26a69a;
      color: white;
      border-radius: 2px;
    }
  }
  .content-change-password {
    max-width: 500px;
    margin: 0px auto;
    border: 1px solid silver;
    padding: 30px;
    box-shadow: 0 0 4px silver;
    border-radius: 4px;
    .text-change-password {
      font-size: 15px;
      color: #26a69a;
      font-style: italic;
      margin: 5px 10px 20px 5px;
    }
  }
}
</style>

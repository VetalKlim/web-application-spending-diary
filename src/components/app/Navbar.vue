
<template>
  <div>
    <div class="line-languish">
      <div class="current-amount">{{'current amount' | localize}}: {{info.bill | currency('UAH')}}</div>
      <div>
        <span class="languish-text" v-on:click.prevent="locationRu">Ru</span>
        <span class="languish-text" v-on:click.prevent="locationEn">En</span>
      </div>
    </div>
    <nav class="navbar lighten-1 nav-bar-color">
      <div class="nav-wrapper">
        <div class="navbar-left">
          <a href="#" v-on:click.prevent="$emit('openNavbar')">
            <!-- вешаем событие на ссылку и передаем с помощью $emit('openNavbar') событие на верх родительскому компонент -->
            <i class="material-icons black-text">dehaze</i>
          </a>
          <span class="write-text">{{date | date('date time') }}</span>
        </div>

        <ul class="right">
          <li>
            <a
              class="dropdown-trigger write-text"
              href="#"
              data-target="dropdown"
              ref="dropdown"
              v-on:click="closeMenu"
            >
              <!-- добавляем референцию для того чтобы можно было работать с этим элементом  -->
              {{ nameUser }}
              <i class="material-icons right">arrow_drop_down</i>
            </a>

            <ul id="dropdown" class="dropdown-content">
              <li>
                <!-- указываем с помощью router-link название ссылки куда будет преходить по клику  -->
                <router-link to="/profile" class="black-text">
                  <i class="material-icons">account_circle</i>
                  {{'ProfileTitle'| localize }}
                </router-link>
              </li>

              <li class="divider" tabindex="-1"></li>
              <!-- ссылка будет вести на  -->
              <li>
                <a href="#" class="black-text" v-on:click.prevent="logout">
                  <!-- Создаем метод logout который будет переправлять на страницу логина -->
                  <i class="material-icons">assignment_return</i>
                  {{'exit'| localize }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    date: new Date(), // переменная которая по умолчанию равняется текущей дате
    interval: null, // для того чтобы можно было управлять интервалом времени создаем переменную в которой лежит данные по таймеру
    dropdown: true, // так же создаем переменную для dropdown
    name: "",
    isRuLocation: "ru-Ru"
  }),
  mounted() {
    (this.interval = setInterval(() => {
      this.date = new Date();
    }, 1000)),
      (this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
        constrainWidth: false
      }));
  },

  beforeDestroy() {
    clearInterval(this.interval);
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy();
    }
  },
  computed: {
    ...mapGetters(["info"]),
    nameUser() {
      return this.$store.getters.info.name;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
    },
    ...mapActions(["updateInfo"]),
    async locationRu() {
      try {
        await this.updateInfo({
          locale: "ru-RU"
        });
      } catch (error) {}
    },
    async locationEn() {
      try {
        await this.updateInfo({
          locale: "en-US"
        });
      } catch (error) {}
    },
    closeMenu() {
      if (window.matchMedia("(max-width: 850px)").matches) {
        this.$emit("closeSidebar");
      }
    }
  }
};
</script>
<style lang="scss">
.line-languish {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.7);
  padding-right: 20px;
  .current-amount {
    color: white;
    padding-left: 10px;
    font-size: 13px;
    // border-bottom: 1px solid;
  }
  .languish-text {
    color: white;
    padding: 2px 10px;
    &:hover {
      background: #26a69a;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}
.navbar {
  position: relative !important;
}
.nav-bar-color {
  background-color: #26a69a;
}
@media all and (max-width: 600px) {
  .navbar {
    padding-right: 10px !important;
    padding-left: 10px !important;
    .navbar-left {
      display: flex;
      flex-direction: column;
      line-height: 0;
      align-items: end;
      flex-flow: column-reverse;
      padding-top: 22px;
      .write-text {
        font-size: 12px !important;
      }
    }
    .right {
      .dropdown-trigger {
        padding-right: 0px !important;
        padding-left: 0px !important;
        font-size: 12px;
      }
    }
  }
}
@media all and (max-width: 340px) {
  .navbar-left {
    padding-top: 0px !important;
    .write-text {
      display: none !important;
    }
  }
}
</style>

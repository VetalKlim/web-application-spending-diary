<template>
  <div>
    <div class="app-main-layout">
      <Navbar v-on:openNavbar="isOpen = !isOpen" v-on:closeSidebar="isOpen = false" />
      <Sidebar v-model="isOpen" v-on:closeSidebar="isOpen = false" :key="locale" />
      <main class="app-content" :class="{full: !isOpen}">
        <Loader v-if="loading" />
        <div class="app-page" v-else>
          <router-view />
        </div>
      </main>

     
      <div class="fixed-action-btn">
        <router-link
          class="btn-floating btn-large cyan pulse"
          to="/record"
          v-tooltip="({html:`${textTooltip}`, position: 'left'})"
        >
          <i class="large material-icons">add</i>
        </router-link>
      </div>
     
    </div>
  </div>
</template>
<script>
import Navbar from "@/components/app/Navbar.vue"; 
import Sidebar from "@/components/app/Sidebar.vue"; 
import messages from "@/utils/messages.js";
import localizeFilter from "@/filters/localize.filter.js";
import moment from "moment"; 
export default {
  mane: "main-layout", 
  data: () => ({
    isOpen: true, 
    loading: true,
    textTooltip: localizeFilter("create_new_record")
  }),
  async mounted() {
    if (Object.keys(this.$store.getters.info).length === 0) {
      await this.$store.dispatch("fetchInfo");
    }
    if (
      moment().format("DD") === "01" &&
      moment().format("hh:mm") === "00:00"
    ) {
      // устанавливаем сумму на текущий месяц с 01 числа 00:00 минут
      await this.$store.dispatch("updateInfo", {
        bill: 0
      });
    }
    this.loading = false;
  },
  created() {},
  computed: {
    error() {
      return this.$store.getters.error;
    },
    locale() {
      return this.$store.getters.info.locale;
    }
  },

  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || "Что то пошло не так");
    }
  },
  components: {
    Navbar,
    Sidebar
  }
};
</script>
<style lang="scss">
.app-content {
  padding-top: 10px !important;
}
@media all and (max-width: 850px) {
  .empty-layout {
    padding-top: 5rem;
    height: 100vh;
  }
}
@media all and (max-width: 600px) {
  .app-content {
    padding-left: 0px !important;
    .app-page {
      padding: 10px;
    }
  }
}
</style>

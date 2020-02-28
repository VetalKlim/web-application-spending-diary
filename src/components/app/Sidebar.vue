<template>
  <div>
    <ul class="sidenav app-sidenav" :class="{open: value }">
      <router-link
        v-for="item in links"
        :key="item.url"
        tag="li"
        active-class="active"
        :to="item.url"
        :exact="item.exact"
        v-on:click.native="closeMenu"
      >
        <a href="#" class="waves-effect waves-orange pointer link-menu menu-mob">{{item.title}}</a>
      </router-link>
      <h4 class="klim">Klimashevskiy.V.P</h4>
    </ul>
  </div>
</template>
<script>
import localizeFilter from "@/filters/localize.filter.js";
export default {
  props: ["value"],
  data: () => ({
    links: [
      { title: localizeFilter("menu_History"), url: "/", exact: true },
      { title: localizeFilter("menu_limit"), url: "/planning" },
      { title: localizeFilter("menu_Records"), url: "/record" },
      { title: localizeFilter("menu_Category"), url: "/categories" }
    ]
  }),
  mounted() {},
  methods: {
    closeMenu() {
      if (window.matchMedia("(max-width: 850px)").matches) {
        this.$emit("closeSidebar");
      }
    }
  }
};
</script>
 <style lang="scss">
.app-sidenav {
  top: 88px !important;
  position: absolute !important;
}
.link-menu {
  font-style: italic;
  color: #144d56 !important;
}
.klim {
  font-size: 16px;
  padding: 10px;
  margin: 20px;
  position: absolute;
  bottom: 23px;
  padding-top: 15px;
  margin-bottom: 0;
  color: #26a69a;
  border-bottom: 1px solid;
  font-style: italic;
}

@media all and (max-width: 850px) {
  .open {
    width: 100% !important;
    .menu-mob {
      text-align: center;
    }
  }
}
</style>

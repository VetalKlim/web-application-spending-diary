<template>
  <div class="table-block-history">
    <a class="dropdown-trigger btn-history" ref="trigger" data-target="dropdown1">
      <i
        v-tooltip="{html:` ${periodHistory}`, position: 'right'}"
        class="material-icons icon-list-history"
      >view_list</i>
    </a>

    <!-- Dropdown Structure -->
    <ul id="dropdown1" class="dropdown-content list-history">
      <li>
        <a v-on:click.prevent="openHistoryDay()">{{"history_casual"| localize}}</a>
      </li>
      <li>
        <a v-on:click.prevent="openHistoryMount()">{{"history_monthly"| localize}}</a>
      </li>
      <li>
        <a v-on:click.prevent="openHistoryYear()">{{"history_annual"| localize}}</a>
      </li>
    </ul>
    <transition name="historyTable">
      <HistoryDay
        v-if="day"
        v-bind:records="records"
        v-bind:categories="categories"
        :key="localize"
      />
      <HistoryMonth v-if="mount" v-bind:records="records" :key="localize" />
      <HistoryYear v-if="year" v-bind:records="records" :key="localize" />
    </transition>
  </div>
</template>
<script>
import localizeFilter from "@/filters/localize.filter.js";
import HistoryDay from "@/components/HistoryDаy.vue";
import HistoryMonth from "@/components/HistoryMonth.vue";
import HistoryYear from "@/components/HistoryYear.vue";
export default {
  props: {
    records: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    day: true,
    mount: false,
    year: false,
    periodHistory: localizeFilter("history_period selection")
  }),
  mounted() {
    M.Dropdown.init(this.$refs.trigger, {
      coverTrigger: false
    });
  },
  computed: {
    localize() {
      return this.$store.getters.info.locale;
    }
  },
  methods: {
    openHistoryDay() {
      this.day = true;
      this.mount = false;
      this.year = false;
    },
    openHistoryMount() {
      this.mount = true;
      this.day = false;
      this.year = false;
    },
    openHistoryYear() {
      this.year = true;
      this.mount = false;
      this.day = false;
    }
  },
  watch: {
    periodHistory() {
      return this.$store.getters.info.locale;
    }
  },
  components: {
    HistoryDay,
    HistoryMonth,
    HistoryYear
  }
};
</script>
<style lang="scss">
.table-block-history {
  border-top: 1px solid silver;
  .active-btn {
    background-color: red !important;
  }
  .list-history {
    width: 200px !important;
  }
}
.btn-history {
  // padding: 7px 10px 5px 10px;
  // font-size: 12px;
  // line-height: 2.2;
  // margin: 10px 10px 10px 0;
  .icon-list-history {
    margin: 10px 10px 0 0;
    font-size: 42px;
    color: #26a69a;
  }
}
.historyTable-enter {
  opacity: 0;
}
.historyTable-enter-active {
  transition: 0.5s;
}
.historyTable-leave-active {
  opacity: 1;
}
.historyTable-leave-to {
  transition: 0s;
}
</style>

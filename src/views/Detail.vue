<template>
  <div>
    <loader v-if="loading" />
    <div v-else>
      <div class="breadcrumb-wrap bread-crumbs">
        <router-link v-tooltip="{html: `${historyBack}`,position: 'top'}" to="/" class="breadcrumb">
          <i class="material-icons icon-link">keyboard_backspace</i>
          {{'menu_History' | localize}}
        </router-link>
        <span
          class="text-link"
          v-tooltip="{html:`${historyBackMonth}`,position: 'bottom'}"
          v-on:click="$router.push('/DetailsMount/'+ recordUser.dateMonth +'/'+ recordUser.dateYear )"
        >
          <i class="material-icons">swap_vert</i>
        </span>
        <a
          class="breadcrumb"
          :class="{
          'outcomeUser': recordUser.type === 'outcome',
          'incomeUser': recordUser.type === 'income' 
           }"
        >{{recordUser.type ==="income"? `${income}` : `${outcome}`}}</a>
      </div>
      <div class="row position-block-card">
        <div class="col s12 m9 positions-details-table">
          <div class="card silver">
            <div class="card-content text-user-card">
              <table>
                <tr>
                  <td>{{'history_category'| localize}}:</td>
                  <td class="text-card-description">{{recordUser.nameCategory}}</td>
                </tr>
                <tr>
                  <td>{{'history_amount'| localize}}:</td>
                  <td class="text-card-description">{{recordUser.amount | currency}}</td>
                </tr>
                <tr>
                  <td>{{'history_descriptions' | localize}}:</td>
                  <td class="text-card-description">{{recordUser.description}}</td>
                </tr>
                <tr>
                  <td>{{'date' | localize}}:</td>
                  <td class="text-card-description">{{recordUser.fullDate}}</td>
                </tr>
              </table>
              <div class="block-edit-record">
                <div
                  class="btn-edit modal-trigger"
                  href="#modalEdit"
                  v-on:click.prevent="editClick"
                >
                  <a class="text-position-edit">{{'history_edit'| localize}}</a>
                </div>
                <div class="btn-edit modal-trigger" href="#modalDelete">
                  <span class="text-position-edit">{{'history_delete'| localize}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal structure edit record -->
    <div id="modalEdit" ref="modalEdit" class="modal modalEditRecord">
      <LoaderLittle v-if="loading" />
      <div class="modal-content">
        <h6 class="title-modal-text">{{'history_edit'|localize}}</h6>
        <p
          class="type-text-modal"
          :class="[type === 'outcome' ? 'red' : 'green']"
        >{{type ==="income"? `${income}` : `${outcome}`}}</p>
        <form class="form-Edit" v-on:submit.prevent="onSubmitEdit">
          <div class="row form-edit-content">
            <div class="input-field col s12">
              <select ref="select" v-model="current">
                <option
                  v-for="list in listCategoty"
                  :key="list.id"
                  :value="list.id"
                  class="label-text-form"
                >{{list.nameCategory}}</option>
              </select>
              <label>{{'history_category_list'|localize}}</label>
              <input type="text" v-model="nameNowCategory" style="display: none" />
            </div>

            <div class="input-field col s12 center-algin">
              <input
                id="sum_user"
                type="text"
                class="text-input"
                v-model.trim.number="summaUser"
                :class="{invalid: ($v.summaUser.$dirty && !$v.summaUser.required) || ($v.summaUser.$dirty && !$v.summaUser.numeric)}"
              />

              <label
                class="label-text-form"
              >{{'history_amount'|localize}} ({{oldAmount | currency}})</label>
              <span
                class="helper-text invalid"
                v-if="($v.summaUser.$dirty && !$v.summaUser.required) || ($v.summaUser.$dirty && !$v.summaUser.numeric)"
              >{{'history_add_Amount'|localize}}</span>
            </div>
            <div class="input-field col s12 center-align">
              <input
                id="distraction_name"
                type="text"
                class="text-input"
                v-model="description"
                v-bind:class="{invalid: $v.description.$dirty && !$v.description.required}"
              />

              <label
                class="label-text-form"
                for="distraction_name"
              >{{"history_descriptions"| localize}} ({{oldDescription}})</label>
              <span
                class="helper-text invalid left-align"
                v-if="$v.description.$dirty && !$v.description.required"
              >{{'history_Enter_a_description_of_the_operation' | localize}}</span>
              <span
                class="helper-text left-align"
                v-else
              >{{'history_description_of_the_operation'| localize}}</span>
            </div>
            <div class="input-field col s12 center-align">
              <input
                type="text"
                id="datepicker2"
                class="datepicker text-input-data"
                v-model.lazy.trim="$v.dateSelect.$model"
                ref="date"
                v-bind:class="{invalid: $v.dateSelect.$error}"
              />
              <span
                class="helper-text invalid left-align"
                v-if="$v.dateSelect.$error"
              >{{'history_date_format'|localize}}</span>
              <span class="helper-text left-align" v-else>{{"date"| localize}}</span>
            </div>
          </div>
        </form>
        <div class="edit-block-btn">
          <div>
            <button
              class="btn"
              :class="{'modal-close': closeModal }"
              v-on:click.prevent="editingClick"
            >{{'history_change'| localize}}</button>
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect btn-exit-edit btn">{{'exit'|localize}}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal structure delete record-->
    <div id="modalDelete" ref="modalDelete" class="modal modalDelete">
      <div class="modal-content">
        <p class="text-warning">{{'history_delete_record' | localize}}</p>
        <div class="block-btn">
          <span
            class="modal-close btn-delete"
            v-on:click.prevent="deleteRecord"
          >{{'history_delete' | localize}}</span>
          <span href="#!" class="modal-close btn-delete">{{'exit'|localize}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required, minValue, numeric } from "vuelidate/lib/validators";
import moment from "moment";
import localizeFilter from "@/filters/localize.filter.js";
import currencyFilter from "@/filters/currency.filter";
import { mapGetters } from "vuex";
export default {
  metaInfo() {
    return {
      title: this.$title("detail")
    };
  },
  name: "detail",
  data: () => ({
    recordUser: null,
    loading: true,
    current: null,
    nameCategory: null,
    select: null,
    nameNowCategory: "",
    summaUser: "",
    description: "",
    listCategoty: null,
    dateSelect: "",
    idRecord: null,
    type: null,
    closeModal: false,
    historyBack: localizeFilter("history_back_to_history"),
    historyBackMonth: localizeFilter("history_for_the_current_month"),
    outcome: localizeFilter("history_outcome"),
    income: localizeFilter("history_income"),
    oldDescription: null,
    oldAmount: null
  }),
  async mounted() {
    this.idRecord = this.$route.params.id; // забираем id записи
    let record = await this.$store.dispatch("fetchRecordById", this.idRecord); // делаем запрос на сервер и передаем  id записи
    // который возвращает запись под такой id
    let category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );
    this.recordUser = {
      ...record,
      nameCategory: category.nameCategory // здесь берем только имя категории
    };
    this.loading = false;
    setTimeout(() => {
      M.Modal.init(this.$refs.modalEdit, {
        preventScrolling: false
      });
      M.Modal.init(this.$refs.modalDelete, {
        preventScrolling: false
      });
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  validations: {
    summaUser: {
      required,
      minValue: minValue(1)
    },
    description: {
      required
    },
    dateSelect: {
      required
    }
  },
  watch: {
    validations: {
      dateSelect: {
        required,
        validDate: val => moment(val, "DD.MM.YYYY", true).isValid() // валидация с помощью moment
      }
    },
    current(categoryId) {
      const { nameCategory } = this.listCategoty.find(c => c.id === categoryId);
      this.nameNowCategory = nameCategory;
    },
    historyBack() {
      return this.$store.getters.info.locale;
    },
    historyBackMonth() {
      return this.$store.getters.info.locale;
    },
    outcome() {
      return this.$store.getters.info.locale;
    },
    income() {
      return this.$store.getters.info.locale;
    }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.summaUser;
    }
  },
  methods: {
    async editClick() {
      this.listCategoty = await this.$store.dispatch("fetchCategories"); 
      let { id, nameCategory } = this.listCategoty[0];
      this.current = id;
      this.nameCategory = nameCategory;
      this.loading = false;
      setTimeout(() => {
        this.select = M.FormSelect.init(this.$refs.select);
        this.datePlugin = M.Datepicker.init(this.$refs.date, {
          defaultDate: new Date(),
          setDefaultDate: true,
          i18n: {
            months: [
              "января",
              "февраля",
              "марта",
              "апреля",
              "мая",
              "июня",
              "июля",
              "августа",
              "сентября",
              "октября",
              "ноября",
              "декабря"
            ],
            monthsShort: [
              "янв",
              "фев",
              "мар",
              "апр",
              "май",
              "июн",
              "июл",
              "авг",
              "сен",
              "окт",
              "ноя",
              "дек"
            ],
            weekdays: [
              "воскресенье",
              "понедельник",
              "вторник",
              "среда",
              "четверг",
              "пятница",
              "суббота"
            ],
            weekdaysShort: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            weekdaysAbbrev: ["В", "П", "В", "С", "Ч", "П", "С"],
            today: "сегодня",
            clear: "удалить",
            cancel: "закрыть"
          },
          firstDay: 1,
          format: "dd.mm.yyyy ",
          formatSubmit: "yyyy/mm/dd"
        });
        // передаем в поле даты ту дату которая была введена при создании категории
        let fullDateUser = [];
        fullDateUser.push(this.recordUser);
        let {
          fullDate,
          type,
          dateMouth,
          dateYear,
          amount,
          description
        } = fullDateUser[0];
        this.dateSelect = fullDate;
        this.type = type;
        this.oldAmount = amount;
        this.oldDescription = description;
      }, 0);
    },

    async editingClick() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.closeModal = true;
      try {
        let year = this.dateSelect.split(".")[2];
        let month = this.dateSelect.split(".")[1];
        let day = this.dateSelect.split(".")[0];
        if (
          moment().format("MM") === month ||
          (moment().format("MM") === this.recordUser.dateMonth &&
            moment().format("YYYY") === year) ||
          moment().format("MM") === this.recordUser.dateYear
        ) {
          if (this.canCreateRecord) {
            let nowEditRecord = {
              categoryId: this.current,
              dateMonth: month,
              dateYear: year,
              dateDay: day,
              id: this.idRecord,
              amount: this.summaUser,
              fullDate: this.dateSelect,
              description: this.description,
              nameCategory: this.nameNowCategory,
              type: this.type
            };
            await this.$store.dispatch("editRecord", nowEditRecord);
            let records = await this.$store.dispatch("fetchRecords");
            let incomeBill = records
              .filter(
                r =>
                  r.type === "income" &&
                  r.dateMonth === moment().format("MM") &&
                  r.dateYear === moment().format("YYYY")
              )
              .reduce((sum, rec) => {
                return (sum += +rec.amount);
              }, 0);

            let outcomeBill = records
              .filter(
                r =>
                  r.type === "outcome" &&
                  r.dateMonth === moment().format("MM") &&
                  r.dateYear === moment().format("YYYY")
              )
              .reduce((sum, rec) => {
                return (sum += +rec.amount);
              }, 0);

            await this.$store.dispatch("updateInfo", {
              bill: `${incomeBill - outcomeBill}`
            });

            this.$message("Запись отредактирована");
            this.$router.push(`/DetailsMount/${month}/${year}`);
          } else {
            console.log("fdgdfgdfgdgdfgdg");
            this.$message(
              // указываем сколько средств не хватает для операции
              `Недостаточно средств на вашем счету не хватает - ${currencyFilter(
                this.summaUser - this.info.bill
              )} `
            );
          }
        } else {
          let nowEditRecord = {
            categoryId: this.current,
            dateMonth: month,
            dateYear: year,
            dateDay: day,
            id: this.idRecord,
            amount: this.summaUser,
            fullDate: this.dateSelect,
            description: this.description,
            nameCategory: this.nameNowCategory,
            type: this.type
          };
          await this.$store.dispatch("editRecord", nowEditRecord);
          this.$message("Запись отредактирована");
          this.$router.push(`/DetailsMount/${month}/${year}`);
        }
      } catch (error) {}
    },

    async deleteRecord() {
      // Метод удаляет запись и корректирует данные по текущему месяцу
      await this.$store.dispatch("deleteRecord", this.idRecord);
      if (
        // корректировка данных по текущему месяцу
        moment().format("MM") === this.recordUser.dateMonth &&
        moment().format("YYYY") === this.recordUser.dateYear
      ) {
        console.log("delete");
        await this.$store.dispatch("updateInfo", {
          bill:
            this.recordUser.type === "income"
              ? `${+this.info.bill - +this.recordUser.amount}`
              : `${+this.info.bill + +this.recordUser.amount}`
        });
      }
      this.$message("Запись удалена");
      this.$router.push("/");
    }
  }
};
</script>
<style lang="scss">
.bread-crumbs {
  background: #f3f3f3;
  padding: 8px;
  border-radius: 3px;
  .icon-link {
    padding-right: 7px;
  }
}
.text-link {
  display: inline-block;
  padding: 0 10px 0 20px;
  cursor: pointer;
}
.outcomeUser {
  font-style: italic;
  &::before {
    color: none;
    color: #26a69a !important;
  }
}
.incomeUser {
  font-style: italic;
  &::before {
    color: none !important;
    color: #26a69a !important;
  }
}
.position-block-card {
  display: flex;
  align-items: center !important;
  .positions-details-table {
    margin: 30px auto;

    .text-user-card {
      color: #155c55;
      p {
        font-weight: bold;
        .text-card-description {
          font-weight: normal;
        }
      }
    }
  }
}
.block-edit-record {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .btn-edit {
    margin: 5px 20px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #26a69a;
    .text-position-edit {
      padding: 10px 15px;
      line-height: 2;
      color: #26a69a;
    }

    &:hover {
      cursor: pointer;
      border-radius: 4px;
      background-color: #26a69a;
      .text-position-edit {
        color: white;
      }
    }
  }
}
.modal {
  max-height: 100%;
  .modal-content {
    .title-modal-text {
      color: #1c7d73;
      font-style: italic;
      border-bottom: 1px solid;
      padding-bottom: 10px;
    }
    .type-text-modal {
      color: white;
      padding: 5px 10px;
      text-align: center;
      border-radius: 2px;
    }
    .form-Edit {
      display: flex;
      .form-edit-content {
        margin-bottom: 0px;
        .input-field {
          .select-wrapper {
            .select-dropdown {
              max-height: 300px !important;
              color: #26a69a;
            }
          }
          .label-text-form {
            color: #1c7d73;
          }
          .text-input-data {
            color: #1c7d73;
          }
        }
      }
      .label-text-form {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 500px;
      }
    }
    .edit-block-btn {
      display: flex;
      justify-content: space-between;
      .modal-footer {
        .btn-exit-edit {
          margin: 0 !important;
        }
      }
    }
  }
}
.text-warning {
  text-align: center;
  color: red;
}
.block-btn {
  display: flex;
  justify-content: space-around;
  height: auto !important;
  padding: 10px;
  .btn-delete {
    color: #26a69a;
    cursor: pointer;
    margin-bottom: 10px;
    padding: 3px 10px;
    border: 1px solid;
    border-radius: 2px;
    &:hover {
      background: #1c7d73;
      color: white;
    }
  }
}
@media all and (max-width: 850px) {
  .position-block-card {
    .positions-details-table {
      margin: 10px auto;
      .text-user-card {
        padding: 14px;
        .block-edit-record {
          .btn-edit {
            margin: 5px !important;
            .text-position-edit {
              font-size: 12px !important;
              padding: 5px !important;
              line-height: 2 !important;
            }
          }
          .icon-edit {
            display: none;
          }
        }
      }
    }
  }
  .modalEditRecord.open {
    top: 0 !important ;
    max-height: 100vh !important;
    height: 100vh;
    .modal-content {
      .title-modal-text-delete {
        font-size: 16px;
        margin: 50% auto 20px auto;
        border-bottom: 1px solid;
        padding-bottom: 10px;
        color: #1c7d73;
        font-style: italic;
      }
      .label-text {
        max-width: 200px !important ;
      }
    }
  }
  .modalDelete.open {
    top: 50px;
    height: auto !important;
    .modal-content {
      padding: 20px 10px 10px 10px;
      .title-modal-text-delete {
        font-size: 16px;
        margin: 50% auto 20px auto;
        border-bottom: 1px solid;
        padding-bottom: 10px;
        color: #1c7d73;
        font-style: italic;
      }
    }
  }
}
@media only screen and (max-width: 1460px) {
  .modal {
    // width: 100%;
    .modal.datepicker-modal.open {
      width: 100%;
    }
  }
}
</style>

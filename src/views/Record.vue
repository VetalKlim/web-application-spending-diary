<template>
  <div>
    <div class="page-title">
      <h3 class="title-text-record">{{'record_new_record'| localize}}</h3>
    </div>
    <Loader v-if="loading" />

    <p class="center" v-else-if="categories.length === 0">
      <span class="center text-category-no">{{'planning_categories_not_yet_added'|localize}}.</span>
      <br />
      <router-link to="/categories">
        <span class="btn addCategoty-record">{{'planning_add_category'|localize}}</span>
      </router-link>
    </p>

    <form class="form form-record" v-else v-on:submit.prevent="onSubmit">
      <div class="input-field">
        <select ref="select" v-model="nowCategory">
        
          <option v-for="list in categories" :key="list.id" :value="list.id">{{list.nameCategory}}</option>
         
        </select>
        <label>{{'record_select_a_category'| localize}}</label>
      </div>
      <input type="text" v-model="valueNameCategory" style="display: none" />
      <p class="radio-block">
        <label class="label-record">
          <input class="with-gap" name="type" type="radio" value="income" v-model="type" />
          
          <span class="text-radio-btn">{{'history_income' | localize}}</span>
        </label>
      </p>

      <p class="radio-block">
        <label class="label-record">
          <input class="with-gap" name="type" type="radio" value="outcome" v-model="type" />
       
          <span class="text-radio-btn">{{'history_outcome' | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="text"
          class="text-input"
          v-model.number="amount"
          :class="{invalid: ($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required) || ($v.amount.$dirty && !$v.amount.numeric)}"
        />
        <label for="amount">{{'history_add_Amount'| localize}}</label>
        <span
          class="helper-text invalid"
          v-if="($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required) || ($v.amount.$dirty && !$v.amount.numeric)"
        >{{'history_add_Amount'| localize}}</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          class="text-input"
          v-model="description"
          v-bind:class="{invalid: $v.description.$dirty && !$v.description.required}"
        />
        <label for="description">{{'history_description_of_the_operation'| localize}}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
        >{{'history_Enter_a_description_of_the_operation'|localize}}</span>
      </div>

      <input
        type="text"
        id="datepicker"
        class="datepicker"
        v-model.lazy.trim="$v.dateSelect.$model"
        ref="date"
        v-bind:class="{invalid: $v.dateSelect.$error}"
      />
      <span
        class="helper-text invalid"
        v-if="$v.dateSelect.$error"
      >{{'history_date_format'| localize}}</span>
      <span class="helper-text datepicker" v-else>{{'date'| localize}}</span>
      <br />
      <br />

      <button class="btn waves-effect waves-light" type="submit">
        {{'record_create'|localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { required, minValue, numeric } from "vuelidate/lib/validators";
import moment from "moment"; // библиотека распаривания времени  детали по ссылке https://momentjs.com/
import { mapGetters } from "vuex"; // импортируем vuex для того чтобы в автоматическом режиме получать getters. Называем её произвольно
export default {
  metaInfo() {
    return {
      title: this.$title("record")
    };
  },
  name: "record",
  data: () => ({
    loading: true,
    select: null,
    dateSelect: null,
    categories: [],
    nowCategory: null, // переменная которая хранит одну текущую категорию
    valueNameCategory: "",
    amount: "", // переменная которая хранит данные по сумме вписываемою в input
    type: "outcome", // переменная которая при клике на радио меняет флаги (доход или расход)
    amount: "", // переменная которая хранит данные которые ввели в input сумма
    description: "" // переменная которая хранит данные по описанию траты или дохода
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories"); // запрос в БД для получения всех категорий
    if (this.categories.length > 0) {
      // выполняем проверку если в массиве элементов больше 0
      const { id, nameCategory } = this.categories[0]; // Далее берем первый элемент с массива и забираем с него id и значение
      this.nowCategory = id; // и задаём переменной id первой категории
      this.valueNameCategory = nameCategory; // в переменной задаем само значение первой категории
      // Таким образом при загрузке списка будет отображаться первый элемент списка
    }
    this.loading = false;
    setTimeout(() => {
      // используем Timeout для того чтобы сразу загрузился список
      // иначе он не загрузится. По сути setTimeout синхронно вызывает эту операцию (но все ровно будет небольшая задержка)
      M.updateTextFields(); //
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
      this.select = M.FormSelect.init(this.$refs.select); // инициализируем через референцию тег в который закинем список
    }, 0); // сразу без задержек
  },
  destroyed() {
    // хук для уничтожения данных при закрытии компонента
    if (this.select && this.select.destroy) {
      // проверяем если список есть и есть у него метод destroy
      this.select.destroy(); // то тогда применяем этот метод к списку (удаляем данные в списке
      // чтобы не тратить память )
  
    }
  },
  validations: {
    amount: {
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
  computed: {
    ...mapGetters(["info"]), // вызываем mapGetters и указываем какой именно нам Getters нужен и указываем оператор спред(...)
    // он говорит что все данные которые есть  у поля info вытаскиваем
    canCreateRecord() {
      if (this.type === "income") {
        // если тип радио кнопки ровняется income (доход)
        return true; // то тогда ставим флаг функции true
      }
      return this.info.bill >= this.amount; // иначе если главная сумма меньше  той что тратится
      // тогда возвращается false
    }
  },
  watch: {
    // следим за полем даты чтобы при изменении сразу повести валидацию
    validations: {
      dateSelect: {
        required,
        validDate: val => moment(val, "DD.MM.YYYY", true).isValid() // валидация с помощью moment
      }
    },
    nowCategory(el) {
      let { nameCategory } = this.categories.find(index => {
        return index.id === el;
      });
      this.valueNameCategory = nameCategory;
    }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        // проверяем если валидация  не успешна
        this.$v.$touch(); // вызываем валидатор
        return; // уходим с функции
      }

      try {
        let year = this.dateSelect.split(".")[2].toString();
        let month = this.dateSelect.split(".")[1].toString();
        let day = this.dateSelect.split(".")[0].toString();

        await this.$store.dispatch("createRecord", {
          // передаем на сервер объект новой записи по таким полям:
          categoryId: this.nowCategory, // категория на которую происходила операция (по id категории)
          amount: this.amount, // сумма
          nameCategory: this.valueNameCategory, // имя категории по которой прошла операция
          description: this.description, // описание
          type: this.type, // тип минус или плюс
          fullDate: this.dateSelect, // дата операции
          dateDay: day,
          dateMonth: month,
          dateYear: year
        });

        console.log(this.dateSelect);

        let nowMonth = moment()
          .format("MM")
          .toString();
        let nowYear = moment()
          .format("YYYY")
          .toString();
        if (nowMonth === month && nowYear === year) {
          if (this.canCreateRecord) {
            // если с функции приходит true
            const bill = // в переменную кладем результат вычисления
              this.type === "income" // если значение радио кнопки поставлено на  income
                ? +this.info.bill + +this.amount // то добавляем его к главной сумме
                : +this.info.bill - +this.amount; // если outcome то отнимаем от главной суммы
            await this.$store.dispatch("updateInfo", { bill }); // на сервер передаем обновление счета

            this.$message("Запись успешно создана ");
            this.$v.$reset(); // сбрасываем форму валидации
            this.amount = ""; // сумму на пустое значение
            this.description = ""; // описание на пустое значение
            this.dateSelect = moment().format("DD.MM.YYYY"); // устанавливаем дату на текущий момент https://momentjs.com/
          } else {
            // если приходит с функции false
            this.$message(
              // указываем сколько средств не хватает для операции
              `Недостаточно средств на вашем счету ${this.amount -
                this.info.bill} `
            );
          }
        } else {
          this.$message("Запись успешно создана ");
          this.$v.$reset(); // сбрасываем форму валидации
          this.amount = ""; // сумму на пустое значение
          this.description = ""; // описание на пустое значение
          this.dateSelect = moment().format("DD.MM.YYYY"); // устанавливаем дату на текущий момент https://momentjs.com/
        }
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss" >
.page-title {
  .title-text-record {
    margin: 0;
    font-size: 1.8rem;
    color: #144d56;
    font-style: italic;
  }
}
.form-record {
  max-width: 100%;
  .select-dropdown {
    color: #26a69a !important;
    max-height: 300px !important;
    color: #26a69a !important;
  }
  .text-category-no {
    padding: 10px;
    margin: 10px;
    display: inline-block;
    color: #26a69a;
    font-size: 20px;
    font-style: italic;
  }
  .addCategoty-record {
    width: auto;
  }
  .radio-block {
    background: #26a69a;
    padding: 10px;
    border-radius: 3px;
    &:hover {
      background: silver;
    }
  }
  .datepicker {
    color: #26a69a;
  }
  .label-record {
    border-radius: 10px;
    color: #ffffff;
    transition: ease-in 0.1s;
    [type="radio"]:checked + span:after,
    [type="radio"].with-gap:checked + span:before,
    [type="radio"].with-gap:checked + span:after {
      background: #26a69a;
      border: 2px solid white;
    }

    span {
      [type="radio"]:not(:checked) + span:before,
      [type="radio"]:not(:checked) + span:after {
        border: 2px solid floralwhite;
      }
    }
    &:hover {
      padding-left: 7px;
      transition: ease-in 0.2s;
    }
  }
  .text-radio-btn {
    width: 100%;
  }
}
.text-input {
  color: #26a69a;
}
@media all and (max-width: 600px) {
  .page-title {
    margin-bottom: 10px;
    padding-bottom: 5px;

    .title-text-record {
      font-size: 17px !important;
    }
  }
  .form-record {
    .input-field {
      margin-top: 20px !important;
    }
  }
}
</style>

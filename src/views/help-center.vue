<template>
  <div class="help-center content-area">
    <div class="hour-email">
      <!-- <div>
        <div class="head">Horario de trabajo</div>
        <div class="item">De lunes a viernes (de 9.00 a 19.00 horas)</div>
      </div> -->
      <div>
        <div class="head">
          <m-icon type="superpeso/邮箱" :width="32" :height="28" />
        </div>
        <div class="item">{{ feedEmail }}</div>
      </div>
    </div>

    <div class="questions">
      <div v-for="(item, index) in questions" :key="item.desc" class="item" @click="showAnswer(index)">
        <div class="desc">
          <span>{{ item.desc }}</span>
          <m-icon class="icon" :class="{ open: item.showAnswer }" type="right" :width="8" :height="12" />
        </div>
        <div class="answer" v-show="item.showAnswer" v-html="item.answer"></div>
      </div>
    </div>

    <!-- <div class="actions">
      <a @click="goComplain">I have a problem to complain</a>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedEmail: 'CreditoHucha@outlook.com',
      questions: [
        {
          desc: '¿Qué es CréditoCash?',
          answer: 'CréditoCash es un prestamista en línea con licencia que ofrece préstamos instantáneos y reembolsos de facturas',
        },
        {
          desc: '¿Por qué elegir CréditoCash?',
          answer: 'CréditoCash es una plataforma de préstamos personales segura, sencilla y rápida. Antes de recibir su salario, si necesita comprar algún producto electrónico u otra cosa en caso de emergencia, puede solicitar un préstamo personal a corto plazo desde CréditoCash.',
        },
        {
          desc: '¿Cómo puedo obtener un préstamo instantáneo?',
          answer: 'Necesita un teléfono Android. Descargue la aplicación CréditoCash desde Google Play Store. Se registra con el número de teléfono, responde algunas preguntas y confirma la identidad para recibir una oferta de préstamo. Si la acepta, recibirá tu préstamo instantáneamente en su cuenta bancaria preferida!',
        },
        {
          desc: '¿Qué puedo hacer si no puedo recibir la OTP cuando inicio sesión en la aplicación?',
          answer: 'El problema de red puede afectar la generación de OTP. Reinicia la aplicación/teléfono e intenta de nuevo. Si realmente no funciona después de algunas veces, no duda en contactar con nosotros a través de nuestro centro de ayuda en la aplicación CréditoCash.',
        },
        {
          desc: '¿Por qué fue rechazada mi solicitud de préstamo?',
          answer: 'Disculpa por eso, puede ser por diferentes razones:<br/>1. No se ha encontrado suficiente información en el teléfono: Debe incrementar el uso del teléfono (llamadas/mensajes) para ser elegible.<br/>2. Decidimos no darle un crédito en este momento después de analizar su perfil.',
        },
        {
          desc: 'Pasé la auditoría y confirmé obtener el préstamo, pero no recibí el dinero de inmediato, ¿por qué?',
          answer: 'En algunos casos, pueden pasar hasta 24 horas para que se apruebe el préstamo y, en consecuencia, se acredite en su cuenta bancaria.',
        },
        {
          desc: '¿Puedo pagar por adelantado en CréditoCash?',
          answer: 'Sí, puede pagar por adelantado en CréditoCash antes de la fecha de vencimiento, esto ayudará a aumentar su puntaje crediticio.',
        },
        {
          desc: '¿Se divulgará mi información personal?',
          answer: 'Hemos agregado un acuerdo confidencial a la aplicación para proteger toda la información personal del usuario y nos aseguramos de que la información no se divulgue a otros. ',
        },
      ],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      color: 'white',
      backgroundColor: 'rgba(93, 221, 155, 0.28)',
      title: 'Centro de ayuda',
    });
  },
  mounted() {
    // setTimeout(async () => {
    //   try {
    //     let user = await this.getUserInfo();
    //     if (parseInt(user.id) % 2 == 1) {
    //       this.feedEmail = 'creditomax03@outlook.com';
    //     }
    //   } catch (error) {}
    // }, 200);
  },

  beforeDestroy() {
    this.setTabBar({
      color: 'black',
      backgroundColor: '#fff',
    });
  },

  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, { ...this.questions[index], showAnswer: !this.questions[index].showAnswer });
    },
    goComplain() {
      this.innerJump('complain-home');
    },
  },
};
</script>

<style lang="scss" scoped>
.help-center {
  padding-bottom: 24px;
  background-image: url(../assets/img/superpeso/贷款确认页.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 280px;
  background-color: #f9f9f9;

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    background: #fff;
    align-items: center;
    a {
      font-size: 14px;
      font-weight: 500;
      color: #1143a4;
      line-height: 18px;
      text-decoration: underline;
    }
  }

  .questions {
    background: #fff;
    padding: 24px 16px;
    margin: auto 16px;
    border-radius: 8px;
    .item {
      width: 100%;
      box-sizing: border-box;
      font-size: 12px;
      margin-bottom: 20px;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
      .desc {
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        color: #000000;

        .icon {
          transition: all 0.3s;
          margin-top: 6px;
          &.open {
            transform: rotate(90deg);
          }
        }
      }
      .answer {
        padding-top: 10px;
        background: #ecfcf6;
        border-radius: 8px;
        font-weight: 400;
        color: #333333;
        padding: 16px;
        margin-top: 16px;
        line-height: 20px;
      }

      &:last-child {
        margin-bottom: none;
      }
    }
  }

  .hour-email {
    background: #fff;
    padding: 24px;
    margin: 24px 16px;
    margin-bottom: 16px;
    border-radius: 8px;

    > div {
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .head {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      flex-shrink: 0;
      img {
        margin: 0 auto;
        margin-bottom: 8px;
      }
    }

    .item {
      flex-grow: 1;
      margin-left: 20px;
      box-sizing: border-box;
      border: none;
      width: 100%;
      color: #000000;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #2a303c;
      line-height: 20px;
    }
  }
}
</style>

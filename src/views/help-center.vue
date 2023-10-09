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
      feedEmail: 'superpesocs01@outlook.com',
      questions: [
        {
          desc: '¿Cómo solicito un préstamo?',
          answer: 'Puede descargar SúperPeso desde la tienda de aplicaciones o la tienda de juegos, registrarse con su número de móvil e iniciar sesión para solicitar un préstamo.',
        },
        {
          desc: '¿Cómo obtengo el importe de un préstamo?',
          answer: 'Inicia sesión en la aplicación. Tras seguir el proceso e introducir la información personal solicitada, evaluaremos tu solicitud una vez completada. Esto determinará si se le concederá una línea de crédito. Para asegurarse de que obtiene el importe del préstamo, le recomendamos que verifique la validez de toda su información.',
        },
        {
          desc: 'He cometido un error al rellenar mi perfil, ¿puedo modificarlo?',
          answer: 'Con el fin de conservar y proteger los datos personales, después de que sus datos se envíen correctamente no se permite la modificación. Por favor, compruebe cuidadosamente la información introducida antes de enviarla.',
        },
        {
          desc: '¿Puedo pagar anticipadamente?',
          answer: 'Absolutamente, pagar por adelantado le ayudará a mejorar su puntuación de crédito y a desbloquear un límite más alto, por lo que podrá pedir más dinero prestado la próxima vez.',
        },
        {
          desc: '¿Cuánto tarda el proceso de aprobación del préstamo?',
          answer: 'Después de rellenar todos tus datos personales y enviar tu solicitud de préstamo, ésta se tramitará en unos minutos o hasta en 1 hora.',
        },
        {
          desc: '¿Puedo cancelar mi préstamo después de haberlo solicitado?',
          answer: 'Hola, no es posible cancelar el préstamo si la solicitud ya está en proceso de revisión. Si ya ha recibido su préstamo, le rogamos que efectúe los reembolsos a tiempo para evitar sanciones por demora.',
        },
        {
          desc: '¿Puedo cambiar mi cuenta bancaria receptora?',
          answer: 'Hola, puede vincular una nueva tarjeta bancaria en Centro Personal - Cuenta receptora y establecerla como tarjeta receptora por defecto, cuando solicite un nuevo préstamo, el importe del préstamo se transferirá a su nueva tarjeta bancaria. Nota: Si hay una orden de préstamo que está siendo solicitada, el importe del préstamo para esta orden seguirá siendo transferido a su tarjeta bancaria anterior, incluso si cambia a una nueva tarjeta bancaria.',
        }
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

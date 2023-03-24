const phoneFormatExp = /^((1[0-9]{10})|(((([0-9]{3}-)?[0-9]{8})|(([0-9]{4}-)?[0-9]{7}))(-[0-9]{1,4})?))$/;

const OperatorType = {
  Add: 1,
  Edit: 2
}

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    phoneNumber: {
      type: String,
      value: ""
    }
  },
  data: {
    phoneInputed: "",
    phoneFieldErrorMessage: "",
    phoneDailog: {
      title: "用户电话",
      confirmButtonText: "确认",
      placeHolder: "请输入电话",
      phoneFieldLabel: "电话"
    }
  },
  observers: {
    "show": function (show) {
      if (show) {
        const operatorType = this.properties.phoneNumber ?
          OperatorType.Edit : OperatorType.Add;
        this.setData({
          phoneDailog: {
            ...this.data.phoneDailog,
            confirmButtonText: operatorType === OperatorType.Add ? "确认" : "修改"
          },
          phoneInputed: this.properties.phoneNumber,
          phoneFieldErrorMessage: ""
        })
      }
    }
  },
  methods: {
    onFieldInput(e) {
      console.log("input field", e.detail);
      if (phoneFormatExp.test(e?.detail)) {
        this.setData({
          phoneInputed: e.detail,
          phoneFieldErrorMessage: ""
        });
      } else {
        this.setData({
          phoneFieldErrorMessage: "电话格式错误，请重新输入"
        })
      }
    },
    onDialogConfirm(e) {
      if (this.data.phoneFieldErrorMessage) return;

      this.triggerEvent("savePhoneNumber", {
        phoneNumber: this.data.phoneInputed
      });
    }
  }
});
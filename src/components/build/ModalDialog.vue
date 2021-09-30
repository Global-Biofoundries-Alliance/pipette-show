<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showModal = false">
        <font-awesome-icon icon="times" />
      </button>
      <span class="modal__title">{{ title }}</span>
      <div class="modal__content">
        <slot>
          <p>
            Vue Final Modal is a renderless, stackable, detachable and
            lightweight modal component.
          </p>
        </slot>
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "model-dialog",

  components: { FontAwesomeIcon },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "",
    },
  },

  computed: {
    showModal: {
      get: function () {
        return this.modelValue;
      },

      set: function (val) {
        this.$emit("update:modelValue", val);
      },
    },
  },

  emits: ["update:modelValue"],
};
</script>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
::v-deep(.modal-content input) {
  width: 80px;
}
::v-deep(.modal-content .submit-button) {
  margin-top: 10px;
  background-color: #fff;
  border-style: solid;
  border-radius: 4px;
  border-color: #aaa;
}
::v-deep(.modal-content .submit-button:hover) {
  background-color: #eee;
}
::v-deep(.modal-content .submit-button:active) {
  background-color: #ddd;
}
.modal__title {
  margin: 0 2rem 0 0;
  margin-bottom: 18px;
  font-size: 13pt;
  font-weight: 700;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>

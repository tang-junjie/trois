import { InstancedMesh } from 'three';
import { inject, watch } from 'vue';
import useBindProp from '../use/useBindProp.js';

export default {
  inject: ['three', 'scene'],
  props: {
    materialId: String,
    count: Number,
    position: Object,
    castShadow: Boolean,
    receiveShadow: Boolean,
  },
  setup() {
    const parent = inject('group', inject('scene'));
    return { parent };
  },
  provide() {
    return {
      mesh: this,
    };
  },
  beforeMount() {
    if (!this.$slots.default) {
      console.error('Missing Geometry');
    }
  },
  mounted() {
    this.initMesh();
  },
  unmounted() {
    this.parent.remove(this.mesh);
  },
  methods: {
    initMesh() {
      if (!this.material && this.materialId) {
        this.material = this.three.materials[this.materialId];
      }

      this.mesh = new InstancedMesh(this.geometry, this.material, this.count);

      useBindProp(this, 'position', this.mesh.position);
      useBindProp(this, 'rotation', this.mesh.rotation);
      useBindProp(this, 'scale', this.mesh.scale);

      ['castShadow', 'receiveShadow'].forEach(p => {
        this.mesh[p] = this[p];
        watch(() => this[p], () => { this.mesh[p] = this[p]; });
      });

      // watch(() => this.materialId, () => {
      //   this.mesh.material = this.three.materials[this.materialId];
      // });

      this.parent.add(this.mesh);
    },
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      if (this.mesh) this.mesh.material = material;
    },
  },
  render() {
    return this.$slots.default();
  },
  __hmrId: 'InstancedMesh',
};

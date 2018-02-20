import Vue from 'vue';
import Router from 'vue-router';

import HelloWorld from '@/pages/HelloWorld';
import Home from '@/pages/Home'
import CropPage from '@/pages/CropPage';
import GalleryPage from '@/pages/GalleryPage';
import ScratchPage from '@/pages/ScratchPage';
import SliderPage from '@/pages/SliderPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/crop',
      name: 'CropPage',
      component: CropPage,
    },
    {
      path: '/gallery',
      name: 'GalleryPage',
      component: GalleryPage,
    },
    {
      path: '/scratch',
      name: 'ScratchPage',
      component: ScratchPage,
    },
    {
      path: '/slider',
      name: 'SliderPage',
      component: SliderPage,
    },
  ],
});

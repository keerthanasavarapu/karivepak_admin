import { configureStore } from '@reduxjs/toolkit';
import mainCategoryReducer from './slice/maincategory.slice';

const store = configureStore({
  reducer: {
    maincategory: mainCategoryReducer,
  },
});

export default store;
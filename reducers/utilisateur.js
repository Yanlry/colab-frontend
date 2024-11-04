import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, username: null, phone: null },
  teach: [],
  learn: [],
  favoris: [],
  collaborations: [],
  destinataireToken: null,  
  nouveauMessage: false, 
};

export const userSlice = createSlice({
  name: 'utilisateur',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.username = action.payload.username;
      state.value.phone = action.payload.phone;
    },
    logout: (state) => {
      state.value = { token: null, email: null, username: null, phone: null, sexe: null, teach: null, learn: null };
      state.teach = [];
      state.learn = [];
      state.destinataireToken = null; 
    },
    teach: (state, action) => {
      state.teach = action.payload;
    },
    learn: (state, action) => {
      state.learn = action.payload;
    },
    ajouteFavoris: (state, action) => {
      state.favoris.push(action.payload);
    },
    suprimeFavoris: (state, action) => {
      state.favoris = state.favoris.filter(annonce => annonce.token !== action.payload);
    },
    updateCollaborations: (state, action) => {
      state.collaborations = action.payload;
    },
    setDestinataireToken: (state, action) => {
      state.destinataireToken = action.payload;
    },
    setNouveauMessage: (state, action) => {
      state.nouveauMessage = action.payload;
    },
  },
});

export const { login, logout, teach, learn, ajouteFavoris, suprimeFavoris, updateCollaborations, setDestinataireToken,setNouveauMessage } = userSlice.actions;
export default userSlice.reducer;

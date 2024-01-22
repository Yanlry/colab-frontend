import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { token: null, email: null, username: null, phone: null, sexe: null },
    jePeux: [],
    jeVeux: [],
    favoris: [],
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
            state.value.sexe = action.payload.sexe;

        },
        logout: (state) => {
            state.value = { token: null, email: null, username: null, phone: null, sexe: null, jePeux: null, jeVeux: null };
            state.jePeux = [];
            state.jeVeux = [];
        },
        jePeux: (state, action) => {
            state.jePeux = action.payload;

        },
        jeVeux: (state, action) => {
            state.jeVeux = action.payload

        },

        ajouteFavoris: (state, action) => {
            state.favoris.push(action.payload);
        },
        suprimeFavoris: (state, action) => {
            state.favoris = state.favoris.filter(annonce => annonce.token !== action.payload);
        },
    },
});


export const { login, logout, jePeux, jeVeux, ajouteFavoris, suprimeFavoris } = userSlice.actions;
export default userSlice.reducer;
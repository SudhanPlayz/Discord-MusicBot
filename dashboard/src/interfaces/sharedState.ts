import { useState } from 'react';

type IBooleanStateRT = ReturnType<typeof useState<boolean>>;

export interface ISharedState {
    navbarShow?: IBooleanStateRT[0];
    setNavbarShow?: IBooleanStateRT[1];
}

import { useEffect, useState } from "react";
export function useToken(){


   
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'token') {
          return value;
        }
    }
    



}
export function setToken(value){
    const expirationDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${'token'}=${value}; ${expires}; path=/`;
}
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900
    &family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');

    body{
        font-family: 'Raleway', san-serif;
    }

    h1{
        font-family: 'Merriweather', san-serif;
    }

`

export default GlobalStyles;
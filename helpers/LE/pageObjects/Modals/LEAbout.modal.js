import leBasePage from '../../LEBasePage'

export default new class LEBottomToolBar extends leBasePage {

    getAboutBody(){
        return '[class*="prompt-module__body"]'
    }

    getVersion(){
        return '[class*="prompt-module__body"] > p'
    }

    getVersionTxt(){
        return 'Absorb UI Version: 5'
    }  

    getCloseXBtn(){
        return '[class*="icon icon-x-thin"]'
    }

    getCloseBtn(){
        return '[class*="btn prompt-module__footer_btn"]'
    }

    getBackdrop(){
        return '[class*="prompt-module__container"]'
    }

}
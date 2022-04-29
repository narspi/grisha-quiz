@@include('node_modules/swiper/swiper-bundle.js')
@@include('node_modules/focus-visible/dist/focus-visible.min.js')
@@include('node_modules/inputmask/dist/inputmask.min.js')


document.addEventListener('DOMContentLoaded',()=>{
    const quizForm = document.querySelector('.quiz__form');
    const quizSliderElem = document.querySelector('.quiz__slider');
    const lineProgress = document.querySelector('.line-progress');
    const watch = document.getElementById('watch');
    let numberProgressDote = 1;
    let permision = false;
    let quizSlider = new Swiper(quizSliderElem,{
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        autoHeight: true,
    });
    let watchSlider = new Swiper(watch,{
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        autoHeight: true,
        lazy: {
            loadPrevNext: true,
        }
    });
    let selector = document.querySelector('.quiz__input-tel');
    let inputMask = new Inputmask("+7 (999) 999-99-99");
    inputMask.mask(selector);
    const regTel = /\+7\ \(\d\d\d\)\ \d\d\d\-\d\d\-\d\d/;
    const regName = /[A-Za-zА-Яа-яЁё]/;
    let data = {};

    function inputFiveChangeText () {
        const text = this.value;
        const step = this.closest('.quiz__step');
        const btn = step.querySelector('.quiz__btn--step');
        if (text.trim().length >=3) {
           step.dataset.permision = true;
           btn.disabled = false;
        } else {
            step.dataset.permision = false;
            btn.disabled = true;
        }
    }

    function stepFinishInput () {
        const step = this.closest('.quiz__step');
        const btn = step.querySelector('.quiz__btn--submit');
        const inputList = step.querySelectorAll('.quiz__input');
        const check = [...inputList].every(input=>{
            if (input.classList.contains('quiz__input-tel')) {
                if (regTel.test(input.value)) return true; else return false;
            }
            if (input.classList.contains('quiz__input-name')) {
                const text = input.value.trim();
                if (text.length>=2 && text.length<=50 && regName.test(text)) return true; else return false;
            }           
        });
        btn.disabled = !check;
        step.dataset.permision = check;
    }

    const changeStep = ()=> {
        quizSlider.slideNext(1000);
        watchSlider.slideNext(1000);
        lineProgress.querySelector(`.line-progress__step[data-number="${numberProgressDote}"]`).classList.remove('active');
        numberProgressDote++;
        const length = lineProgress.children[1].children.length;
        if (numberProgressDote !== length) {
            const span = lineProgress.querySelector('.line-progress__descr span');
            span.textContent = numberProgressDote;
        } else {
            const descr = lineProgress.querySelector('.line-progress__descr');
            descr.innerHTML = 'Последний этап';
        }
        const dote = lineProgress.querySelector(`.line-progress__step[data-number="${numberProgressDote}"]`)
        dote.classList.add('done');
        dote.classList.add('active');
    }
    
    quizSliderElem.addEventListener('click',event => {
        const target = event.target;
        let typeStep = null;
        let quizStep = null;
        if (target.closest('.quiz__step')) {
            quizStep = target.closest('.quiz__step');
            typeStep = quizStep.dataset.type;
            permision = quizStep.dataset.permision === 'true' ? true : false;
        }
        if (typeStep === 'dropdown-check') {
            const stepBtn = quizStep.querySelector('.quiz__btn--step');
            if (target.classList.contains('quiz__input')) {
                const inputList = quizStep.querySelectorAll('.quiz__input');
                const countInputList = inputList.length;
                const elem = target;
                if (elem === inputList[countInputList - 2]) {
                    const labelPreLast = inputList[countInputList-1].parentNode

                    labelPreLast.style.opacity = 1;
                    labelPreLast.classList.remove('hidden-opacity');
                    quizStep.dataset.permision = false;
                    stepBtn.disabled = true;
                }   else if (elem === inputList[countInputList - 1]) {
                    elem.addEventListener('input',inputFiveChangeText);
                } else {
                    inputList[countInputList - 1].value = "";
                    const label5 = inputList[countInputList - 1].parentNode
                    label5.style.opacity = 0; 
                    label5.classList.add('hidden-opacity');
                    quizStep.dataset.permision = true;
                    stepBtn.disabled = false;
                }
            }
        }

        if (typeStep === 'radio') {
            const stepBtn = quizStep.querySelector('.quiz__btn--step');
            if (quizStep) {
                permision = quizStep.dataset.permision === 'true'? true : false;
            }

            if (target.classList.contains('quiz__input')) {
                quizStep.dataset.permision = true;
                stepBtn.disabled = false;
            }
        }

        // if (typeStep === 'xz') {
        //     const stepBtn = quizStep.querySelector('.quiz__btn--step');
        //     const fieldsetList = quizStep.querySelectorAll('.quiz__fieldset');
        //     permision = Boolean(quizStep.dataset.permision);

        //     if (target.closest('.quiz__input')) {
        //         const elem = target.closest('.quiz__input');
        //         const fieldset = target.closest('.quiz__fieldset');
        //         const inputList = fieldset.querySelectorAll('.quiz__input');
        //         if (elem === inputList[inputList.length-1]) {
        //             for (let i=0;i<inputList.length-1;i++) {
        //                 inputList[i].checked = false;
        //             }
        //         } else {
        //             inputList[inputList.length-1].checked = false;
        //         }
        //         const check = [... fieldsetList].every(fieldset=>{
        //             const inputList = fieldset.querySelectorAll('.quiz__input');
        //             const fieldsetCheck = [...inputList].some(input=>{
        //                return Boolean(input.checked);
        //            });
        //            return fieldsetCheck;
        //         });
        //         quizStep.dataset.permision = check;
        //         stepBtn.disabled = !check;
        //     } 
        // }

        if (typeStep === 'finish') {
            quizStep.dataset.stepNumber = numberProgressDote;
            const inputList = quizStep.querySelectorAll('.quiz__input');
            inputList.forEach(input=>{
                input.addEventListener('input',stepFinishInput);
            });  
                  
            if (target.closest('.quiz__btn--submit')) {
                const form = target.closest('.quiz__form');
                const steps = form.querySelectorAll('.quiz__step');
                steps.forEach(step=>{
                    const typeStep = step.dataset.type;
                    const numberStep = Number(step.dataset.stepNumber);
                    if (typeStep === 'dropdown-check') {
                        const question = step.querySelector('.quiz__fieldset-legend').textContent;
                        data[`step${numberStep}`] = {
                            "question": question
                        }
                        const inputList = step.querySelectorAll('.quiz__input');
                        let currentIndex = -1;
                        for (let i=0; i<inputList.length-1;i++) {
                            if (Boolean(inputList[i].checked) === true ) {
                                currentIndex = i;
                                const answer = inputList[i].closest('.quiz__label').textContent.trim();
                                data.step1.answer = answer;
                            }
                        } 
                        if (currentIndex === inputList.length - 2) {
                            data.step1.answer = inputList[inputList.length-1].value;
                        }
                    }

                    if (typeStep === 'radio') {
                        const inputList = step.querySelectorAll('.quiz__input');
                        const question = step.querySelector('.quiz__fieldset-legend').textContent;
                        data[`step${numberStep}`] = {
                            "question": question
                        }
                        for (let i=0; i<inputList.length;i++) {
                            if (Boolean(inputList[i].checked) === true ) {
                                const answer = inputList[i].closest('.quiz__label').textContent.trim();
                                data[`step${numberStep}`].answer = answer;
                            }
                        }
                    }

                    // if (numberStep === 3 || numberStep === 4) {
                    //     const inputList = step.querySelectorAll('.quiz__input');
                    //     const question = step.querySelector('.quiz__fieldset-legend').textContent;
                    //     data[`step${numberStep}`] = {
                    //         "question": question
                    //     }
                    //     data[`step${numberStep}`].answer = [];
                    //     for (let i=0; i<inputList.length;i++) {
                    //         if (Boolean(inputList[i].checked) === true ) {
                    //             const answer = inputList[i].closest('.quiz__label').textContent.trim();
                    //             data[`step${numberStep}`].answer.push(answer);
                    //         }
                    //     }
                    // }

                    if (typeStep === 'finish') {
                        const inputList = step.querySelectorAll('.quiz__input');
                        inputList.forEach(input=>{
                            data[`${input.name}`] = input.value;
                        })
                        
                    }
                });
                fetch('telegram.php',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(response=>{
                    return response.json()
                })
                .then(answer=>{
                    if (answer.ok === true) window.location.href = `${answer.page}`;
                    else alert('Упс что то пошлоне так. Попробуйте позже');
                })
                .catch(err => alert('Возможно нет соединения'));
            }

        }

        if (target.classList.contains('quiz__btn--step') && (permision === true)) {
            quizStep.dataset.stepNumber = numberProgressDote;
            changeStep();
            quizStep.querySelectorAll('.quiz__input').forEach(element => {
                element.setAttribute('tabindex',-1);
            });
            setTimeout(()=>{
                quizStep.querySelector('.quiz__btn--step').disabled = true;
            },1000)
            quizStep.nextElementSibling.querySelectorAll('.quiz__input').forEach(element => {
                element.removeAttribute('tabindex');
            });
        }  
    });

    quizForm.addEventListener('focusin',event => {
        const target = event.target;
        if (!target.closest('.quiz__step')) return;  
        if (target.classList.contains('quiz__input-name')) {
            const elem = target.closest('.quiz__input-name');
            elem.addEventListener('input',stepFinishInput);
        }
        if (target.classList.contains('quiz__input-tel')) {
            const elem = target.closest('.quiz__input-tel');
            elem.addEventListener('input',stepFinishInput);
        }
    });

    quizForm.addEventListener('submit',event => {
        event.preventDefault();
    });
});

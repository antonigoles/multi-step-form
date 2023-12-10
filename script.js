(()=>{
    const $ = (selector) => document.querySelector(selector);
    const $all = (selector) => document.querySelectorAll(selector);

    window.currentStep = 1

    const BilingTypes = {
        monthly: "Monthly",
        yearly: "Yearly"
    }

    window.billingType = BilingTypes.monthly;
    window.nextButtonDisabled = false;
    window.selectedPlan = "Advanced";
    window.selectedAddons = ["larger_storage"];
    
    function goToStep(n) {
        $(`.section-${window.currentStep}`).style.display = "none";
        $(`.step-${window.currentStep} > .index`).classList.remove("selected");
        window.currentStep = n;
        $(`.section-${window.currentStep}`).style.display = "flex";
        $(`.step-${window.currentStep} > .index`).classList.add("selected");
    }

    function nextStep() {
        if ( window.nextButtonDisabled ) return;
        if ( window.currentStep == 4 ) return showEndScreen();
        if ( window.currentStep == 5 ) return;
        goToStep( window.currentStep + 1 );
        if ( window.currentStep == 4 ) fillOutSummaryScreen();
    }

    function previousStep() {
        if ( window.currentStep == 1 ) return;
        goToStep( window.currentStep - 1 );
    }

    function showEndScreen() 
    {
        $(`.section-${window.currentStep}`).style.display = "none";
        window.currentStep = 5;
        $(`.section-${window.currentStep}`).style.display = "flex";
        $(`.mobile-navigator`).style.display = "none";
    }

    function switchBilling() {
        if ( window.billingType == BilingTypes.monthly ) {
            window.billingType = BilingTypes.yearly
            $(".switch-body").classList.add("switched");
            $(".label-yearly").classList.add("selected");
            $(".label-monthly").classList.remove("selected");
            $all(".plan-card > .label > .price").forEach( label => { label.style.display = "none" })
            $all(".addon-block > .price-yearly").forEach( label => { label.style.display = "block" })
            $all(".addon-block > .price").forEach( label => { label.style.display = "none" })
            $all(".price-yearly").forEach( label => { label.style.display = "block" })
            $all(".yearly-deal").forEach( label => { label.style.display = "block" })
        } else {
            window.billingType = BilingTypes.monthly;
            $(".switch-body").classList.remove("switched");
            $(".label-yearly").classList.remove("selected");
            $(".label-monthly").classList.add("selected");
            $all(".plan-card > .label > .price").forEach( label => { label.style.display = "block" })
            $all(".addon-block > .price-yearly").forEach( label => { label.style.display = "none" })
            $all(".addon-block > .price").forEach( label => { label.style.display = "block" })
            $all(".price-yearly").forEach( label => { label.style.display = "none" })
            $all(".yearly-deal").forEach( label => { label.style.display = "none" })
        }
    }

    $all(".next-step-btn").forEach( btn => {
        btn.addEventListener("click", nextStep);
    })

    $all(".prev-step-btn").forEach( btn => {
        btn.addEventListener("click", previousStep);
    })

    $all(".plan-card").forEach( card => {
        card.addEventListener("click", () => {
            $all(".plan-card").forEach( c => c.classList.remove("selected") )
            card.classList.add("selected");
            window.selectedPlan = card.id;
        })
    })

    $all(".addon-block").forEach( addon => {
        addon.addEventListener("click", () => {
            if ( addon.classList.contains("selected") ) {
                addon.classList.remove("selected")
                window.selectedAddons = window.selectedAddons.filter(e=>e!=addon.id) 
            }
            else {
                addon.classList.add("selected")
                window.selectedAddons.push(addon.id)
            }
        })
    })

    $(".switch-body").addEventListener("click", switchBilling)

    function checkInputValidity() {
        let onefailed = false;
        $all(".input-box").forEach( inputBox => {
            if ( inputBox.validity.valid ) $(`.label-error-${inputBox.id}`).style.display = "none";
            else  $(`.label-error-${inputBox.id}`).style.display = "block";
            onefailed |= !inputBox.validity.valid;
        })
        if ( onefailed ) {
            window.nextButtonDisabled = true;
            $all(".next-step-btn").forEach(e=>e.style.opacity = "0.2")
        } else {
            window.nextButtonDisabled = false;
            $all(".next-step-btn").forEach(e=>e.style.opacity = "1")
        }
    }

    function fillOutSummaryScreen() {
        const priceString = (price, prefix) => {
            if ( window.billingType == BilingTypes.monthly ) {
                return `${prefix}$${price}/mo`
            } else {
                return `${prefix}$${price}/yr`
            }
        }

        const planPricing = {
            "Monthly": {
                "Arcade": 9,
                "Advanced": 12,
                "Pro": 15,
            },

            "Yearly": {
                "Arcade": 90,
                "Advanced": 120,
                "Pro": 150,
            }
        }

        $(".billing-list>.main-service>.type>.label")
            .innerHTML = `${window.selectedPlan} (${window.billingType})`;
        $(".billing-list>.main-service>.price")
            .innerHTML = priceString(planPricing[window.billingType][window.selectedPlan],"");

        const translateAddon = {
            "online_services": "Online services",
            "larger_storage": "Larger storage",
            "custom_profile": "Customizable Profile",
        }

        const addonPrices = {
            "Monthly": {
                "online_services": 1,
                "larger_storage": 2,
                "custom_profile": 2,
            },

            "Yearly": {
                "online_services": 10,
                "larger_storage": 20,
                "custom_profile": 20,
            }
        }

        // hydrate list
        $(".section-4>.input>.billing-list>.addons-list")
        .innerHTML = window.selectedAddons.map( addon => {
            return `
            <div class="le">
                <span class="label">${translateAddon[addon]}</span>
                <span class="price">${priceString(addonPrices[window.billingType][addon], "+")}</span>
            </div>
          `
        }).join("")

        let totalPrice = [...(window.selectedAddons.map(addon=>addonPrices[window.billingType][addon])), 
        (planPricing[window.billingType][window.selectedPlan]) ].reduce((a,b) => a+b);

        $(".total>.price").innerHTML = priceString(totalPrice, "")
    }

    $all(".input-box").forEach( inputBox => {
        inputBox.addEventListener("input", e => {
            checkInputValidity();
        })
    })

    $(".change-btn").addEventListener("click", () => {
        goToStep(2);
    })

    // nextStep();
    // nextStep();
    // nextStep();
    checkInputValidity();
    // showEndScreen();
    // nextStep();
    // nextStep();
    // nextStep();

})();
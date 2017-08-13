describe("Circle creation flow",function(){
    browser.get(browser.params.homepage + "user/mycircles/");

    it(" requires login to view my circles",function(){
         var facebook_login = element(by.buttonText("Login with Facebook"));
         expect(browser.getCurrentUrl()).toEqual(browser.params.homepage+"login");

         facebook_login.click();
         browser.params.fblogin();

         expect(browser.getCurrentUrl()).toEqual(browser.params.homepage+"user/mycircles/");
    });

    it(" creates a circle ",function(){
        var start = element(by.buttonText("Start a new circle"));
                 browser.sleep(1000);
        start.click().then(function(){
            expect(browser.getCurrentUrl()).toContain(browser.params.homepage+"circle/view/");

            var payout = element(by.css("span.payout_amount_text"));
            expect(payout.getText()).toEqual("£10,000");
        });

        //var install = element(by.binding("money(circle.in"))
    }); 

    it("with correct count of joins",function(){
        var slots = element.all(by.css(".empty_circle_container"));
        expect(slots.count()).toEqual(11);

    }); 

    it("lists joins correctly asc" , function(){
        var slots = element.all(by.css(".empty_circle_container"));
        var first = slots.first().all(by.css("p.payout")).first().all(by.css(".slot_position_no")).first();
        expect(first.getText()).toEqual("1");

        var second = slots.get(1).all(by.css("p.payout")).first().all(by.css(".slot_position_no")).first();
        expect(second.getText()).toEqual("2");

        var third = slots.get(2).all(by.css("p.payout")).first().all(by.css(".slot_position_no")).first();
        expect(third.getText()).toEqual("3");
    });
/*
    it(" can edit payout", function(){
        var el = element(by.css(".ui-slider-handle"));
        browser.actions().dragAndDrop(el,{x:100,y:0}).mouseUp(el).perform();

        browser.sleep(1100);
        expect(element(by.binding("money(circle.payout_amount);")).getText()).toEqual("€800");

        var slots = element.all(by.repeater("circleslot in circle_joins"));
        expect(slots.count()).toEqual(6*2);
    });

    it(" can edit payout", function(){

        var el = element.all(by.css(".ui-slider-handle")).get(1);
        browser.actions().dragAndDrop(el,{x:300,y:0}).mouseUp(el).perform();

        browser.sleep(1100);
        expect(element(by.binding("money(circle.installement);")).getText()).toEqual("€400");

        var slots = element.all(by.repeater("circleslot in circle_joins"));
        expect(slots.count()).toEqual(3*2);
    });
 */


    it(" can save circle ",function(){
        var save = element(by.buttonText("Save Circle"));
        browser.executeScript("arguments[0].scrollIntoView();", save.getWebElement());
        save.click().then(function () {
            var popover = element(by.css(".popover"));
            expect(popover.isDisplayed()).toEqual(true);

            var popover_resolve_button = element(by.css(".popover-resolve-button"));
            popover_resolve_button.click()

            browser.sleep(1000);

            var askForUserDetails = element(by.id("askForUserDetails"));
            expect(askForUserDetails.isDisplayed()).toEqual(true);

            var country = element(by.model("user.residency_country"));
            country.sendKeys("EG");

            var city = element(by.model("user.city"));
            city.sendKeys("Cairo");

            var area = element(by.model("user.area"));
            area.sendKeys("Masaken Sheraton");

            var address = element(by.model("user.address"));
            address.sendKeys("Heliopolis");

            var save_user_details = element(by.css(".save-user-details"));
            save_user_details.click();

            browser.sleep(500);

            var inviteForm = element(by.id("inviteModal"));
            expect(inviteForm.isDisplayed()).toEqual(true);

            var close = element(by.id("invite-model-close"));
            close.click();

            browser.sleep(1000);
            // Expect changes done
            // expect(element(by.binding("money(circle.installement);")).getText()).toEqual("€400");

            // Expect Edit mode done
            var de = element(by.buttonText("Delete circle"));
            expect(de.isDisplayed()).toEqual(false);

        })

    });

    it(" can change slot ",function(){
        var slot = element.all(by.css(".empty_circle_slot")).get(2);
        browser.executeScript("arguments[0].scrollIntoView();", slot.getWebElement());
        slot.click().then(function () {
            var popover = element(by.css(".popover"));
            browser.executeScript("arguments[0].scrollIntoView();", popover.getWebElement());
            expect(popover.isDisplayed()).toEqual(true);

            var popover_resolve_button = element(by.css(".popover-resolve-button"));
            popover_resolve_button.click()

            browser.sleep(1000);

            var askForUserDetails = element(by.id("askForUserDetails"));
            expect(askForUserDetails.isDisplayed()).toEqual(true);

            var country = element(by.model("user.residency_country"));
            country.sendKeys("EG");

            var city = element(by.model("user.city"));
            city.sendKeys("Cairo");

            var area = element(by.model("user.area"));
            area.sendKeys("Masaken Sheraton");

            var address = element(by.model("user.address"));
            address.sendKeys("Heliopolis");

            var save_user_details = element(by.css(".save-user-details"));
            save_user_details.click();

            browser.sleep(500);

            var inviteForm = element(by.id("inviteModal"));
            expect(inviteForm.isDisplayed()).toEqual(true);

            var close = element(by.id("invite-model-close"));
            close.click();

            browser.sleep(1000);

            var slot_user_display = element.all(by.css(".slot_user_display")).get(2);
            expect(slot_user_display.isDisplayed()).toEqual(true);

            var empty_circle_slot = element.all(by.css(".empty_circle_slot")).get(2);
            expect(empty_circle_slot.isDisplayed()).toEqual(false);
            // Expect changes done
            // expect(element(by.binding("money(circle.installement);")).getText()).toEqual("€400");

        })



    });

    it(" can delete circle",function(){
        var edit_button = element(by.buttonText("Edit Circle"));
        // expect(edit_button.isDisplayed()).toEqual(true);
        browser.executeScript("arguments[0].scrollIntoView();", edit_button.getWebElement());

        // Can go into edit mode again.
        edit_button.click();
        browser.sleep(1000);
        var de = element(by.buttonText("Delete circle"));
        expect(de.isDisplayed()).toEqual(true);
        // browser.executeScript("arguments[0].scrollIntoView();", de.getWebElement());
        de.click();
        browser.sleep(1100);
        expect(browser.getCurrentUrl()).toEqual(browser.params.homepage+"user/mycircles/");
    });
});
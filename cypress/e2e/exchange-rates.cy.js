describe('exchange rates', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  
  it('create a new exchange rate between USD and EUR', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('5');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');
  });
  
  it('create duplicated exchange rate', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('5');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate creation failed
    cy.get('body').should('contain', 'The currency pair must be unique.');
  });

  it('create exchange rate with same target and source currencies', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('5');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate creation failed
    cy.get('body').should('contain', 'The source and target currencies must differ.');
  });

  it('create exchange rate without ratio', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate creation failed
    cy.get('body').should('contain', 'Please enter exchange rate ratio.');
  });

  it('edits the exchange rate created', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]'); 
    // Click on create button
    cy.get('*[class^="icon pencil"]').click();
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('10');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    
    // Assert that exchange rate has been updated
    cy.get('body').should('contain', 'Exchange rate has been successfully updated.');
  });

  it('deletes the exchange rate created', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]'); 
    // Click on create button
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr > td:nth-child(5) > div > form > button').click();

    cy.get('*[class^="ui green ok inverted button"]').click();

    // Assert that exchange rate has been updated
    cy.get('body').should('contain', 'Exchange rate has been successfully deleted.');
  });

  it('filter exchange rates', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('5');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Click on Cancel button
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.buttons > a').click();

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select Canadian Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('CAD');
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('10');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.buttons > a').click();

    // select Canadian Dollar option
    cy.get('#criteria_currency').select('5');
    cy.get('*[class^="icon search"]').click();

    cy.get('table').should('not.contain', 'US Dollar');
  });
  

  it('clear filters', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // clear filters
    cy.get('*[class^="icon remove"]').click();

    cy.get('table').should('contain', 'Canadian Dollar');
    cy.get('table').should('contain', 'US Dollar');
  });

  it('delete selected rate', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('NZD');
    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('3');
    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Click on Cancel button
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.buttons > a').click();
    
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr:nth-child(1) > td.center.aligned > input').click()

    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.sylius-grid-nav > div.sylius-grid-nav__bulk > form > button').click()

    cy.get('*[class^="ui green ok inverted button"]').click();

    cy.get('table').should('not.contain', 'New Zealand Dollar');
  });
  
  it('delete all rates', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > thead > tr > th.center.aligned > input[type=checkbox]').click();
    
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.sylius-grid-nav > div.sylius-grid-nav__bulk > form > button').click()

    cy.get('*[class^="ui green ok inverted button"]').click();

    cy.get('body').should('contain', 'There are no results to display');
  });
  // Implement the remaining test cases in a similar manner
});
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('exchange rates', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  it('create a new exchange rate between USD and EUR', async () => {
    // Click in exchange rates in side menu
    await driver.findElement(By.linkText('Exchange rates')).click();

    // Click on create button
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await buttons[0].click();

    // Select US Dollar Source currency
    const dropdown = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await dropdown.findElement(By.xpath("//option[. = 'US Dollar']")).click();

    // Type ratio to 5
    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('5');

    // Click on create button
    const buttonToCreate = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate[0].click();

    // Assert that exchange rate has been created
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Exchange rate has been successfully created.'));
  });

  it('create duplicated exchange rate', async () => {
    // Click in exchange rates in side menu
    await driver.findElement(By.css('a[href="/admin/exchange-rates/"]')).click();
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon button  primary "]')).click();
    // Select US Dollar Source currency
    const dropdown = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await dropdown.findElement(By.xpath("//option[. = 'US Dollar']")).click();
    // Type ratio to 5
    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('5');
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon primary button"]')).click();
    // Assert that exchange rate creation failed
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('The currency pair must be unique.'));
  });

  it('create exchange rate with same target and source currencies', async () => {
    // Click in exchange rates in side menu
    await driver.findElement(By.css('a[href="/admin/exchange-rates/"]')).click();
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon button  primary "]')).click();
    // Type ratio to 5
    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('5');
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon primary button"]')).click();
    // Assert that exchange rate creation failed
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('The source and target currencies must differ.'));
  });

  it('create exchange rate without ratio', async () => {
    // Click in exchange rates in side menu
    await driver.findElement(By.css('a[href="/admin/exchange-rates/"]')).click();
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon button  primary "]')).click();
    // Select US Dollar Source currency
    const dropdown = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await dropdown.findElement(By.xpath("//option[. = 'US Dollar']")).click();
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon primary button"]')).click();
    // Assert that exchange rate creation failed
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Please enter exchange rate ratio.'));
  });

  it('edits the exchange rate created', async () => {
    // Click in exchange rates in side menu
    await driver.findElement(By.css('a[href="/admin/exchange-rates/"]')).click(); 
    // Click on create button
    await driver.findElement(By.css('*[class^="icon pencil"]')).click();
    // Type ratio to 10
    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('10');
    // Click on create button
    await driver.findElement(By.css('*[class^="ui labeled icon primary button"]')).click();
    // Assert that exchange rate has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Exchange rate has been successfully updated.'));
  });

  it('deletes the exchange rate created', async () => {
    await driver.findElement(By.linkText('Exchange rates')).click();
    
    const deleteButton = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr > td:nth-child(5) > div > form > button'));
    await deleteButton[0].click();
    
    const okButton = await driver.findElements(By.css('*[class^="ui green ok inverted button"]'));
    await okButton[0].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Exchange rate has been successfully deleted.'));
  });

  it('filter exchange rates', async () => {
    await driver.findElement(By.linkText('Exchange rates')).click();

    const createButton = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await createButton[0].click();
    
    const dropdown = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await dropdown.findElement(By.xpath("//option[. = 'US Dollar']")).click();

    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('5');

    const buttonToCreate = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate[0].click();

    const buttonToCancel = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.buttons > a'));
    await buttonToCancel[0].click();

    const createButton2 = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await createButton2[0].click();
    
    const dropdown2 = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await dropdown2.findElement(By.xpath("//option[. = 'Canadian Dollar']")).click();

    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('10');

    const buttonToCreate2 = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate2[0].click();

    const buttonToCancel2 = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.buttons > a'));
    await buttonToCancel2[0].click();

    const filter = await driver.findElement(By.id('criteria_currency'));
    await filter.findElement(By.xpath("//option[. = 'Canadian Dollar']")).click();

    const filterButton = await driver.findElements(By.css('*[class^="icon search"]'));
    await filterButton[0].click();

    const table = await driver.findElement(By.tagName('table')).getText();
    
    assert(!(table.includes('US Dollar')));
  });
  
  it('clear filters', async () => {
    await driver.findElement(By.linkText('Exchange rates')).click();

    const clearFilterButton = await driver.findElements(By.css('*[class^="icon remove"]'));
    await clearFilterButton[0].click();

    const table = await driver.findElement(By.tagName('table')).getText();

    assert((table.includes('Canadian Dollar')));
    assert((table.includes('US Dollar')));
  });

  it('delete selected rate', async () => {
    await driver.findElement(By.linkText('Exchange rates')).click();

    const createButton = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await createButton[0].click();
    
    const dropdown = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await dropdown.findElement(By.xpath("//option[. = 'New Zealand Dollar']")).click();

    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys('3');

    const buttonToCreate = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate[0].click();

    const buttonToCancel = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.buttons > a'));
    await buttonToCancel[0].click();

    const checkbox = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr:nth-child(1) > td.center.aligned > input'));
    await checkbox[0].click();

    const deleteButton = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.sylius-grid-nav > div.sylius-grid-nav__bulk > form > button'));
    await deleteButton[0].click();

    const okButton = await driver.findElements(By.css('*[class^="ui green ok inverted button"]'));
    await okButton[0].click();

    const table = await driver.findElement(By.tagName('table')).getText();
    
    assert(!(table.includes('New Zealand Dollar')));
  });
  
  it('delete all rates', async () => {
    await driver.findElement(By.linkText('Exchange rates')).click();
    
    const checkbox = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > thead > tr > th.center.aligned > input[type=checkbox]'));
    await checkbox[0].click();

    const deleteButton = await driver.findElements(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.sylius-grid-nav > div.sylius-grid-nav__bulk > form > button'));
    await deleteButton[0].click();

    const okButton = await driver.findElements(By.css('*[class^="ui green ok inverted button"]'));
    await okButton[0].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
  });

});

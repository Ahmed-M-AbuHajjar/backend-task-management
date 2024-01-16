/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Builder, By, Capabilities, WebDriver,until } from 'selenium-webdriver';

@Injectable()
export class LinkedInService {
  private driver: WebDriver | null = null;


  private async getDriver(): Promise<WebDriver>{
    if(!this.driver){
      this.driver = new Builder().withCapabilities(Capabilities.chrome().set('chromeOptions', { args: ['--headless'] })).build();    }
    return this.driver;
  }

  async scrapeUserProfile(linkedinUrl: string): Promise<any> {
    let driver: WebDriver;
    try {
      driver = await this.getDriver();
      await driver.get(linkedinUrl);
      await driver.wait(until.titleContains('LinkedIn'),30000);


      const nameElement = await driver.wait(until.elementLocated(By.css('.text-heading-xlarge')), 30000);
      const name = await nameElement.getText();
      

      return {
        userName:name,
      };
    } catch(error){
      console.error('Error during LinkedIn scraping:', error.message);
      throw error;
    }
  }

  async closeDriver(){
    if(this.driver){
      await this.driver.quit();
      this.driver = null
    }
  }
}
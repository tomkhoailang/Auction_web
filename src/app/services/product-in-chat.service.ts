import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'path';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductInChatService {
  productList: any;
  currentBiddingProduct: any;
  currentChatRoomProduct: any;
  isSet$ = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}
  setCurrentBiddingProduct(room: string) {
    let chatRoomProducts = this.productList
      .map((pl: any) => pl.chatRoomProducts)
      .flat();
    let currentChatRoomProduct = chatRoomProducts.find(
      (crp: any) =>
        new Date(crp.biddingStartTime) <= new Date() &&
        new Date(crp.biddingEndTime) >= new Date() &&
        crp.chatRoomId === Number.parseInt(room)
    );

    if (currentChatRoomProduct !== undefined) {
      this.currentChatRoomProduct = currentChatRoomProduct;
      this.currentBiddingProduct = this.productList.find(
        (pl: any) => pl.productId == currentChatRoomProduct.productId
      );
      this.isSet$.next(true);
    }
  }
  getCurrentBiddingPrice() {
    const bids = this.currentBiddingProduct.biddings.flat();
    const maxBiddingAmount = bids.reduce((max: any, bid: any) => {
      return bid.biddingAmount > max ? bid.biddingAmount : max;
    }, this.currentBiddingProduct.initialPrice);
    console.log('test 5', this.currentBiddingProduct);
    return maxBiddingAmount;
  }
  getMinBiddingPrice() {
    return (
      this.getCurrentBiddingPrice() + this.currentBiddingProduct.minimumStep
    );
  }
  createBidding(biddingAmount: number) {
    let url = `http://localhost:5274/api/product/${this.currentBiddingProduct.productId}/biddings`;
    let data = {
      BiddingAmount: biddingAmount,
    };
    return this.httpClient.post(url, data);
  }
  getNextProductTime(room: string): any {
    console.log('need to test right now', this.productList);

    let chatRoomProducts = this.productList
      .map((pl: any) => pl.chatRoomProducts)
      .flat()
      .filter((crp: any) => crp.chatRoomId === Number.parseInt(room))
      .sort((a: any, b: any) => {
        return (
          new Date(a.biddingStartTime).getTime() -
          new Date(b.biddingStartTime).getTime()
        );
      });
    let dateToCheck = new Date();
    if (this.currentBiddingProduct !== undefined) {
      dateToCheck = new Date(this.currentChatRoomProduct.biddingEndTime);
    }
    console.log('this is the error', dateToCheck);
    let nextCrp = chatRoomProducts.find(
      (crp: any) =>
        dateToCheck < new Date(crp.biddingEndTime) &&
        dateToCheck < new Date(crp.biddingStartTime)
    );

    console.log('init test', nextCrp);
    if (nextCrp === undefined) {
      return 'Next product time: No bidding left';
    }
    let nextProductTime = this.getProductTime(
      new Date(nextCrp.biddingStartTime)
    );
    return 'Next product time: ' + nextProductTime;
  }
  isWaiting() {
    if (this.currentBiddingProduct === undefined) {
      return true;
    }
    return false;
  }
  getProductTime(date: any): any {
    const endTime = new Date(date).getTime();
    const currentTime = new Date().getTime();

    const remainingMilliseconds = endTime - currentTime;
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));

    const seconds = remainingMilliseconds / 1000 - remainingHours * 3600;
    const remainingMinutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${remainingHours}h:${remainingMinutes}p:${remainingSeconds}s`;
  }
}

"use client"
import { useEffect } from "react"
import ReviewCard from "./ReviewCard"


const Testimonials = () => {
  useEffect(
    () => {
      const scroller = document.querySelector('#infinite-scroller');
      const itemsContainer = scroller?.querySelector('#scroller-items');
      const items = Array.from(itemsContainer?.children as HTMLCollection);
      
      items.forEach(item => {
        const duplicateItem = item.cloneNode(true) as HTMLElement;
        duplicateItem.setAttribute('aria-hidden', 'true');
        itemsContainer?.appendChild(duplicateItem);
      })
    }, [])

  return (
    <>
    <section className="bg-[whitesmoke] pt-20 px-20">
        <div id="infinite-scroller" className="overflow-hidden infinite_scroller_mask">
          <div id="scroller-items" className="flex gap-10 items-center pb-[60px] pt-10 w-fit animate-infinite-scroll hover:animate-pause">
            <ReviewCard user="AlphaUser1" heading="Delicious Food Lorem ipsum dolor sit amet." body="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere illo voluptatem quia expedita error? Dolor amet minus voluptas nemo commodi? Ipsum, temporibus."/>
            <ReviewCard user="AlphaUser2" heading="Delicious Food Lorem ipsum dolor sit amet." body="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere illo voluptatem quia expedita error? Dolor amet minus voluptas nemo commodi? Ipsum, temporibus."/>
            <ReviewCard user="AlphaUser3" heading="Delicious Food Lorem ipsum dolor sit amet." body="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere illo voluptatem quia expedita error? Dolor amet minus voluptas nemo commodi? Ipsum, temporibus."/>
            <ReviewCard user="AlphaUser4" heading="Delicious Food Lorem ipsum dolor sit amet." body="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere illo voluptatem quia expedita error? Dolor amet minus voluptas nemo commodi? Ipsum, temporibus."/>
            <ReviewCard user="AlphaUser5" heading="Delicious Food Lorem ipsum dolor sit amet." body="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere illo voluptatem quia expedita error? Dolor amet minus voluptas nemo commodi? Ipsum, temporibus."/>
          </div>
        </div>
    </section>
    </>
  )
}

export default Testimonials
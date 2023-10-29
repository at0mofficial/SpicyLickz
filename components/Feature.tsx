import React from 'react'
import FeatureCard from './FeatureCard'
import { featureItems } from '@/constants'


const Feature = () => {
  return (
    <section className="flex flex-col mt-[70px] justify-between items-center pt-10">
        <h2 className="text-[50px] font-extrabold text-dark uppercase">Why us?</h2>
      <div className="bg-primary h-[2px] w-[80px]"></div>
      <div className="flex flex-wrap w-full gap-10 justify-center items-start mt-10 bg-secondary p-10">
       {
        featureItems.map((item)=>(
            <FeatureCard key={item.title} title={item.title} desc={item.desc} imgUrl={item.imgUrl} />
        ))
       }
      </div>
    </section>
  )
}

export default Feature
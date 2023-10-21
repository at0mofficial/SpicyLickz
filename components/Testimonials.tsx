import ReviewCard from "./ReviewCard"


const Testimonials = () => {
  return (
    <section className="bg-[whitesmoke] p-20">
        <div className="flex gap-10 items-center">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        </div>
    </section>
  )
}

export default Testimonials
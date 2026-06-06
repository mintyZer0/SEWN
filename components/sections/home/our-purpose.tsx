export default function OurPurpose(){
    return(
      <div className="flex flex-row h-full w-full items-stretch justify-start bg-transparent overflow-hidden my-12 lg:my-24">
        {/* Left Block */}
        <div className="bg-orchid w-8 md:w-24 lg:w-48 shrink-0 rounded-r-3xl lg:rounded-r-[40px]"></div>
        
        {/* Text Content */}
        <div className="flex flex-col w-full max-w-xl lg:max-w-4xl gap-4 py-6 lg:py-12 pl-6 lg:pl-16 pr-4 lg:pr-8">
          <h2 className="text-4xl lg:text-[64px] text-heading font-medium mb-2 lg:mb-4 tracking-tight">our purpose.</h2>
          <p className="text-black text-base md:text-lg lg:text-[26px] leading-[1.6] font-light">
            we celebrate the beauty and strength of womanhood by honoring the
            local heritage craftsmanship of homemaker-artisans, showcasing Filipino
            pride, creativity, and resilience rooted in the spiritual
            and cultural identity of various village artisan communities in the
            Philippines.
          </p>
        </div>

        {/* Right Block */}
        <div className="bg-orchid flex-1 rounded-l-3xl lg:rounded-l-[40px] ml-4 lg:ml-12"></div>
      </div>
    )
}
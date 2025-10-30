
const Hero = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        // style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
          Craft Perfect
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Cocktails</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-foreground/80 md:text-xl">
          Discover hundreds of cocktail recipes, filter by your favorite spirits and ingredients
        </p>
        
      
      </div>
    </section>
  );
};

export default Hero;
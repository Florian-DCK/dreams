import Card from "@/components/Card";

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-background mt-5">
            <Card> 
                <div className="flex items-center justify-center space-x-10">
                    <img src="library.jpg" className="h-80" alt="" />
                    <div className="flex flex-col items-center max-w-sm">
                        <h1 className="text-3xl font-bold text-left ">
                            Bienvenue sur Dreams !
                        </h1>
                        <p className="text-left mt-2">
                            Découvrez <span className=" font-bold">Dreams</span>, votre compagnon idéal pour les passionnés de lecture ! Créez votre carnet de lecture personnalisé, suivez votre Pile À Lire (PAL), notez vos impressions sur chaque livre et gardez un œil sur vos stats (pages lues, livres terminés...). Exprimez votre créativité en embellissant votre carnet avec des travaux créatifs uniques. Inscrivez-vous dès maintenant et transformez vos lectures en une aventure inoubliable !
                        </p>
                        <a href="/register" className="mt-5 px-4 py-2 bg-primary text-white rounded hover:bg-[#6768bb]">
                            Commencer
                        </a>
                    </div>
                </div>
            </Card>
        </div>
    );
}
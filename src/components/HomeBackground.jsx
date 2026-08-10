function HomeBackground({children}){
    return (
        <div>
            <section className="h-[50%] bg-[url('./img/bolas.png')] bg-green-400/30  mt-20 mb-20 flex justify-between ">
                {children}
            </section>
        </div>
    )
}

export default HomeBackground
let cardCarList;

export async function getCardCarList() {
    if (cardCarList) return cardCarList;

    try {
        const jsonData = await fetch("/json/cardCarList.json");
        cardCarList = await jsonData.json();
        return cardCarList;
    } catch (error) {
        console.error("Error occured fetching card car list:", error);
    }
}
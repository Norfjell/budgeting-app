import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Account() {
    const [currency, setCurrency] = useState("EUR");
    const [income, setIncome] = useState("");
    const [savingsGoal, setSavingsGoal] = useState("");
    const [needs, setNeeds] = useState("");
    const [wants, setWants] = useState(0);
    const [isModified, setIsModified] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            const ref = doc(db, "accounts", userId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setCurrency(data.currency || "EUR");
                setIncome(data.income || "");
                setSavingsGoal(data.savingsGoal || "");
                setNeeds(data.needs || "");
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        const total = Number(savingsGoal) + Number(needs);
        if (total > 100) {
            setError("Savings + Needs cannot exceed 100%");
            setWants(0);
        } else {
            setError("");
            setWants(100 - total);
        }
    }, [savingsGoal, needs]);

    const handleSave = async () => {
        if (!userId || error) return;

        try {
            await setDoc(doc(db, "accounts", userId), {
                currency,
                income,
                savingsGoal,
                needs,
                wants,
                timestamp: Date.now(),
            });
            setSaved(true);
            setIsModified(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Save error:", err.message);
        }
    };

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
        setIsModified(true);
        setSaved(false);
    };

    const calculateAmount = (percent) =>
        income && percent ? ((Number(income) * Number(percent)) / 100).toFixed(2) : "0.00";

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow rounded flex flex-col lg:flex-row gap-6">
            {/* Form Section */}
            <div className="w-full lg:w-2/3">
                <h2 className="text-xl font-semibold mb-4">My Account</h2>

                <label className="block mb-2">Currency</label>
                <select
                    className="border w-full mb-4 p-2 rounded"
                    value={currency}
                    onChange={(e) => {
                        setCurrency(e.target.value);
                        setIsModified(true);
                        setSaved(false);
                    }}
                >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="RON">RON</option>
                </select>

                <label className="block mb-2">Monthly Income</label>
                <input
                    type="number"
                    className="border w-full mb-4 p-2 rounded"
                    value={income}
                    onChange={(e) => {
                        const value = Math.max(0, Math.floor(e.target.value));
                        setIncome(value);
                        setIsModified(true);
                        setSaved(false);
                    }}
                    placeholder="e.g. 3000"
                    step="1"
                />

                <label className="block mb-2">Savings Goal (%)</label>
                <input
                    type="number"
                    placeholder="e.g. 20"
                    className="border w-full mb-4 p-2 rounded"
                    value={savingsGoal}
                    onChange={(e) => {
                        const value = Math.max(0, Math.floor(e.target.value));
                        setSavingsGoal(value);
                        setIsModified(true);
                        setSaved(false);
                    }}
                    min={0}
                    max={100}
                    step="1"
                />

                <label className="block mb-2">Needs (%)</label>
                <input
                    type="number"
                    placeholder="e.g. 50"
                    className="border w-full mb-4 p-2 rounded"
                    value={needs}
                    onChange={(e) => {
                        const value = Math.max(0, Math.floor(e.target.value));
                        setNeeds(value);
                        setIsModified(true);
                        setSaved(false);
                    }}
                    min={0}
                    max={100}
                    step="1"
                />

                <p className="mb-4 text-gray-700">
                    <strong>Wants (%):</strong> {wants}%
                    <br />
                    <span className="text-sm text-gray-500">
                        ({calculateAmount(wants)} {currency})
                    </span>
                </p>

                <button
                    className={`px-4 py-2 rounded text-white ${isModified
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } transition`}
                    onClick={handleSave}
                    disabled={!isModified}
                >
                    {saved ? "Saved!" : "Save Settings"}
                </button>
            </div>

            {/* Description Section */}
            <div className="w-full lg:w-1/3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="text-md font-semibold mb-2">How it works</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Currency</strong>: Choose your preferred currency for budgeting.</li>
                    <li><strong>Monthly Income</strong>: Enter your total income for one month.</li>
                    <li><strong>Savings Goal (%)</strong>: How much of your income you want to save.</li>
                    <li><strong>Needs (%)</strong>: Essential expenses like rent, food, bills.</li>
                    <li><strong>Wants (%)</strong>: Calculated automatically (the rest).</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                    The total of Savings + Needs must be 100% or less. The difference goes to Wants.
                </p>
            </div>
        </div>
    );
}
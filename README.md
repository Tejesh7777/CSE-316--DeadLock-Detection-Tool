# Deadlock Detection & Visualization Tool

A visualization-based project designed to detect, analyze, and display deadlocks in operating systems using Process–Resource Allocation Graphs. This tool helps students and developers understand how deadlocks occur, how detection algorithms work, and how resource interactions lead to circular wait conditions.

APP LINK--deadlockdetector.netlify.app

🚀 Features

🔍 Deadlock Detection Algorithm
Identifies circular wait conditions in process–resource graphs.

📊 Graph Visualization
Displays processes, resources, and edges in an easy-to-understand visual interface.

🧠 Dynamic Simulation
Users can input custom scenarios to check for deadlocks.

🎯 Real-Time Feedback
Highlights detected deadlocks and affected nodes clearly.

🧩 Modular Code Structure
Easy to extend for other OS algorithms.

📁 Project Structure
├── src/
│   ├── main code files
│   ├── graph generation
│   ├── detection algorithm
│   └── UI/visualization components
├── assets/
│   └── screenshots (optional)
├── README.md
└── (add your GitHub link later)

⚙️ How It Works

User enters processes, resources, and allocation/request data.

Tool constructs a Resource Allocation Graph (RAG).

Deadlock detection algorithm scans for:

circular wait

hold & wait conditions

nodes with no possible execution path

If deadlock exists → affected nodes turn red.

Visualization updates dynamically.

🛠️ Technologies Used

C++ / Java / Python (update depending on your project)

Graph visualization library

Console or GUI-based interface

Standard OS deadlock detection algorithms

▶️ How to Run

Clone the repository

git clone <your-repository-link>
cd deadlock-detection-tool


Compile the code

g++ main.cpp -o deadlock_tool


Run

./deadlock_tool


(Update based on your project’s exact code)

📝 Input Format (Example)
Processes: P1, P2, P3
Resources: R1, R2
Allocations: P1->R1, P2->R2
Requests: P1->R2, P2->R1

📌 Output

Shows whether a deadlock exists

Highlights processes/resources involved

Graphical representation of the wait-for cycle

📷 Screenshots
<img width="1918" height="868" alt="image" src="https://github.com/user-attachments/assets/cfbe24f3-747c-456e-8807-e55c2e465975" />
<img width="1918" height="748" alt="image" src="https://github.com/user-attachments/assets/f260b8db-674a-4f49-aa47-697abef859ab" />
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/991a8ae6-a86c-4760-9953-9c7b27d6ddde" />
<img width="1918" height="642" alt="image" src="https://github.com/user-attachments/assets/44ffdf60-5e73-4e40-89f6-deb76a648a82" />
<img width="1901" height="847" alt="image" src="https://github.com/user-attachments/assets/73843d31-3528-4efe-8689-bf9477ea22a2" />
<img width="1917" height="852" alt="image" src="https://github.com/user-attachments/assets/caa90c40-1118-4740-9039-bddb1680b1e6" />
<img width="1918" height="821" alt="image" src="https://github.com/user-attachments/assets/5a64efe8-29ba-46e6-8a21-69efbc1e3189" />
<img width="1918" height="836" alt="image" src="https://github.com/user-attachments/assets/09acf4b5-bc90-41d9-b467-839847f5c491" />
<img width="1918" height="882" alt="image" src="https://github.com/user-attachments/assets/08f408b8-01ea-41bb-9193-0b797fb4e3f7" />
Feel free to fork the repo, open issues, or submit pull requests.

📄 License

This project is licensed under the MIT License.

📬 Contact

For queries or improvements, feel free to reach out or raise an issue.

# Deadlock Detection & Visualization Tool

A visualization-based project designed to detect, analyze, and display deadlocks in operating systems using Process–Resource Allocation Graphs. This tool helps students and developers understand how deadlocks occur, how detection algorithms work, and how resource interactions lead to circular wait conditions.

## 🌐 Live Demo
APP LINK — https://deadlockdetector.netlify.app

## 🚀 Features
- 🔍 **Deadlock Detection Algorithm:** Identifies circular wait conditions in process–resource graphs.
- 📊 **Graph Visualization:** Displays processes, resources, and edges in an intuitive interface.
- 🧠 **Dynamic Simulation:** Users can input custom scenarios to check for deadlocks.
- 🎯 **Real-Time Feedback:** Highlights detected deadlocks and affected nodes clearly.
- 🧩 **Modular Code Structure:** Easy to extend for other OS algorithms.

## 📁 Project Structure

├── src/
│ ├── main code files
│ ├── graph generation
│ ├── detection algorithm
│ └── UI/visualization components
├── assets/
│ └── screenshots (optional)
├── README.md
└── (add your GitHub link later)


## ⚙️ How It Works
1. User enters processes, resources, and allocation/request data.  
2. Tool constructs a Resource Allocation Graph (RAG).  
3. Deadlock detection algorithm scans for:  
   - circular wait  
   - hold & wait conditions  
   - nodes with no possible execution path  
4. If deadlock exists → affected nodes turn red.  
5. Visualization updates dynamically.

## 🛠️ Technologies Used
- Java Script / Html
- Graph visualization library
- Console or GUI-based interface
- Standard OS deadlock detection algorithms

## ▶️ How to Run
### Clone the repository
git clone <your-repository-link>
cd deadlock-detection-tool


### Compile the code


g++ main.cpp -o deadlock_tool


### Run


./deadlock_tool


*(Update based on your project’s exact code)*

## 📝 Input Format (Example)

Processes: P1, P2, P3
Resources: R1, R2
Allocations: P1->R1, P2->R2
Requests: P1->R2, P2->R1


## 📌 Output
- Shows whether a deadlock exists  
- Highlights processes/resources involved  
- Graphical representation of the wait-for cycle  

## 📷 Screenshots
<img width="1919" height="869" alt="Screenshot 2025-12-09 141729" src="https://github.com/user-attachments/assets/5ee6773f-4391-4508-b68e-f8b0e6ec1583" />
<img width="1919" height="867" alt="Screenshot 2025-12-09 141958" src="https://github.com/user-attachments/assets/b811b3a9-1a6b-44ee-a822-cce415d4d57d" />
<img width="1901" height="847" alt="Screenshot 2025-12-09 142240" src="https://github.com/user-attachments/assets/1ff66a6a-6386-4831-858a-7d31285eb969" />
<img width="1919" height="821" alt="Screenshot 2025-12-09 142415" src="https://github.com/user-attachments/assets/7e684b69-8804-4dfd-83b8-63165d2b12b3" />
<img width="1901" height="847" alt="Screenshot 2025-12-09 142240" src="https://github.com/user-attachments/assets/d0aa0703-b37e-4aa7-ac36-0e84675aab43" />
<img width="1919" height="836" alt="Screenshot 2025-12-09 142449" src="https://github.com/user-attachments/assets/e51ac820-8c31-4bfd-a380-24bc758bc967" />
<img width="1919" height="883" alt="Screenshot 2025-12-09 142529" src="https://github.com/user-attachments/assets/b514abe4-06e7-4fae-a778-3cb9a0d6b193" />
<img width="1919" height="643" alt="Screenshot 2025-12-09 142032" src="https://github.com/user-attachments/assets/e714b9bb-90e6-4bc7-8684-5df75d27f8b3" />
<img width="1917" height="853" alt="Screenshot 2025-12-09 142324" src="https://github.com/user-attachments/assets/f9db6e29-4bb5-420a-9fa0-f7f384e8e908" />
<img width="1919" height="821" alt="Screenshot 2025-12-09 142415" src="https://github.com/user-attachments/assets/457875e4-f6e8-4c28-93cf-7dc1b6514058" />


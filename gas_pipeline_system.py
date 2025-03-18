"""
This is a simpler gas pipeline system developed by Python PyQt that allows you to create a gas pipeline network and visualize the flow of gas through the network.
"""
import tkinter as tk

class GasPipelineSystem:
    def __init__(self, root):
        self.root = root
        self.canvas = tk.Canvas(root, width=800, height=600, bg='white')
        self.canvas.pack()

        # Initialize elements
        self.elements = []
        self.connections = []
        self.selected_element = None
        self.offset_x = 0
        self.offset_y = 0

        # Add buttons for adding elements
        self.add_buttons()

        # Bind mouse events
        self.canvas.bind("<Button-1>", self.select_element)
        self.canvas.bind("<B1-Motion>", self.move_element)
        self.canvas.bind("<ButtonRelease-1>", self.release_element)
        self.canvas.bind("<Button-3>", self.delete_element)

    def add_buttons(self):
        tk.Button(self.root, text="Add Gas Source", command=self.add_gas_source).pack(side=tk.LEFT)
        tk.Button(self.root, text="Add Switch", command=self.add_switch).pack(side=tk.LEFT)
        tk.Button(self.root, text="Add Connector", command=self.add_connector).pack(side=tk.LEFT)
        tk.Button(self.root, text="Add Pipeline", command=self.add_pipeline).pack(side=tk.LEFT)
        tk.Button(self.root, text="Update Colors", command=self.update_pipeline_colors).pack(side=tk.LEFT)

    def add_gas_source(self):
        x, y = 100, 100
        rect = self.canvas.create_rectangle(x, y, x+30, y+30, fill='blue')
        self.elements.append(('gas_source', rect))

    def add_switch(self):
        x, y = 200, 100
        circle = self.canvas.create_oval(x, y, x+30, y+30, fill='black')
        self.elements.append(('switch', circle, False))  # False indicates switch is off
        self.canvas.tag_bind(circle, "<Button-1>", self.toggle_switch)

    def add_connector(self):
        x, y = 300, 100
        diamond = self.canvas.create_polygon(x+15, y, x+30, y+15, x+15, y+30, x, y+15, fill='grey')
        self.elements.append(('connector', diamond))

    def add_pipeline(self):
        x1, y1, x2, y2 = 400, 100, 500, 100
        line = self.canvas.create_line(x1, y1, x2, y2, fill='black')
        self.connections.append(line)

    def select_element(self, event):
        self.selected_element = self.canvas.find_closest(event.x, event.y)[0]
        coords = self.canvas.coords(self.selected_element)
        self.offset_x = event.x - coords[0]
        self.offset_y = event.y - coords[1]

    def move_element(self, event):
        if self.selected_element:
            x, y = event.x - self.offset_x, event.y - self.offset_y
            coords = self.canvas.coords(self.selected_element)
            dx, dy = x - coords[0], y - coords[1]
            self.canvas.move(self.selected_element, dx, dy)

            # Snap lines to center of elements
            if self.canvas.type(self.selected_element) == 'line':
                self.snap_line_to_element(self.selected_element)

    def release_element(self, event):
        self.selected_element = None

    def delete_element(self, event):
        element = self.canvas.find_closest(event.x, event.y)[0]
        self.canvas.delete(element)
        self.elements = [e for e in self.elements if e[1] != element]

    def snap_line_to_element(self, line):
        x1, y1, x2, y2 = self.canvas.coords(line)
        for element in self.elements:
            element_type, element_id = element[:2]
            coords = self.canvas.coords(element_id)
            if len(coords) == 4:  # Rectangle or oval
                ex, ey, ex2, ey2 = coords
                center_x, center_y = (ex + ex2) / 2, (ey + ey2) / 2
            elif len(coords) == 8:  # Polygon (diamond)
                center_x = sum(coords[::2]) / 4
                center_y = sum(coords[1::2]) / 4
            else:
                continue

            if abs(x1 - center_x) < 20 and abs(y1 - center_y) < 20:
                self.canvas.coords(line, center_x, center_y, x2, y2)
            if abs(x2 - center_x) < 20 and abs(y2 - center_y) < 20:
                self.canvas.coords(line, x1, y1, center_x, center_y)

    def update_pipeline_colors(self):
        # Reset all lines to black
        for line in self.connections:
            self.canvas.itemconfig(line, fill='black')

        # Initialize status for all elements and lines
        element_status = {element[1]: False for element in self.elements}
        line_status = {line: False for line in self.connections}

        # Set gas source status to True and start DFS for each gas source
        for element in self.elements:
            if element[0] == 'gas_source':
                element_status[element[1]] = True
                self.dfs_propagate_gas(element[1], element_status, line_status)

        # Update line colors based on status
        for line in self.connections:
            if line_status[line]:
                self.canvas.itemconfig(line, fill='green')

    def dfs_propagate_gas(self, source_id, element_status, line_status):
        stack = [source_id]

        while stack:
            current_id = stack.pop()
            current_coords = self.canvas.coords(current_id)
            if len(current_coords) < 4:
                continue  # Skip if coordinates are not valid

            center_x, center_y = (current_coords[0] + current_coords[2]) / 2, (current_coords[1] + current_coords[3]) / 2

            for line in self.connections:
                line_coords = self.canvas.coords(line)
                if len(line_coords) == 4:  # Ensure the line has valid coordinates
                    x1, y1, x2, y2 = line_coords
                    if (abs(x1 - center_x) < 20 and abs(y1 - center_y) < 20) or (abs(x2 - center_x) < 20 and abs(y2 - center_y) < 20):
                        if not line_status[line]:  # Avoid re-processing
                            line_status[line] = True
                            self.dfs_propagate_gas_through_line(line, element_status, line_status, stack)

    def dfs_propagate_gas_through_line(self, line, element_status, line_status, stack):
        line_coords = self.canvas.coords(line)
        if len(line_coords) == 4:  # Ensure the line has valid coordinates
            x1, y1, x2, y2 = line_coords
            for element in self.elements:
                element_type, element_id = element[:2]
                coords = self.canvas.coords(element_id)
                if len(coords) == 4:  # Rectangle or oval
                    ex, ey, ex2, ey2 = coords
                    center_x, center_y = (ex + ex2) / 2, (ey + ey2) / 2
                elif len(coords) == 8:  # Polygon (diamond)
                    center_x = sum(coords[::2]) / 4
                    center_y = sum(coords[1::2]) / 4
                else:
                    continue

                if (abs(x1 - center_x) < 20 and abs(y1 - center_y) < 20) or (abs(x2 - center_x) < 20 and abs(y2 - center_y) < 20):
                    if element_type == 'switch' and not element[2]:  # Skip if switch is off
                        continue
                    if not element_status[element_id]:  # Avoid re-processing
                        element_status[element_id] = True
                        stack.append(element_id)
                        for connected_line in self.connections:
                            if connected_line != line and not line_status[connected_line]:
                                stack.append(connected_line)

    def toggle_switch(self, event):
        switch_id = self.canvas.find_closest(event.x, event.y)[0]
        for i, element in enumerate(self.elements):
            if element[1] == switch_id and element[0] == 'switch':
                # Toggle the switch state
                new_state = not element[2]
                self.elements[i] = (element[0], element[1], new_state)
                # Update the switch color
                new_color = 'green' if new_state else 'black'
                self.canvas.itemconfig(switch_id, fill=new_color)
                break

if __name__ == "__main__":
    root = tk.Tk()
    app = GasPipelineSystem(root)
    root.mainloop()

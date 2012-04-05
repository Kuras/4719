/*
Source: https://wiki.cse.unsw.edu.au/cs1917cgi/08s1/4719_Microprocessor

Architecture

There are 16 Memory locations and 4 registers
Each memory location and register holds a number between 0 and 15
all arithmetic operations are mod 16
Registers

IP = Instruction Pointer
IS = Instruction Store
R0 = General Register 0
R1 = General Register 1
Instruction Codes

1-byte1 Instructions
0 = Halt
1 = Add (R0 = R0 + R1)
2 = Subtract (R0 = R0 - R1)
3 = Increment R0 (R0 = R0 + 1)
4 = Increment R1 (R1 = R1 + 1)
5 = Decrement R0 (R0 = R0 - 1)
6 = Decrement R1 (R1 = R1 - 1)
7 = Ring Bell
2-byte Instructions, value of the second byte is called [data]
8 = Print [data] (The numerical value of [data] is printed)
9 = Load value at address [data] into R0
10 = Load value at address [data] into R1
11 = Store R0 into address [data]
12 = Store R1 into address [data]
13 = Jump to address [data]
14 = Jump to address [data] if R0 == 0
15 = Jump to address [data] if R0 != 0
Start Up

All registers are set to 0
All memory locations are set to 0
The program is read into the memory. The first instruction into address 0, and so on.
the fetch-execute cycle begins
Fetch-Execute Cycle

The instruction at the address given by IP is loaded into IS
The IP is incremented by 1 (if IS contains a one byte instruction) or by 2 (if IS contains a 2 byte instruction)
The instruction in IS is executed
Repeat until IS = HALT
Examples

*/

var program = []


var cpu = {
	ip: 0, // Instruction Pointer
	is: 0, // Instruction Store
	r0: 0, // General Register 0
	r1: 0, // General Register 1
	log_callback: null, 

	log: function(message){
		if(cpu.log_callback != null){
			cpu.log_callback(message);
		}
	},

	reset: function(){
		cpu.ip = 0;
		cpu.is = 0;
		cpu.r0 = 0;
		cpu.r1 = 0;
	},

	run: function(log_callback){
		cpu.log_callback = log_callback;
		cpu.reset();

		cpu.log("Running program: " + program);
		var tb_r0 = document.getElementById('r0');
		var tb_r1 = document.getElementById('r1');
		
		while(true){
			cpu.step();

			tb_r0.value = cpu.r0;
			tb_r1.value = cpu.r1;
			// cpu.dump();

			// check if program is done
			if(cpu.is == 0){
				cpu.log("Program terminated successfully.");
				break;
			}
		}
	},

	dump: function(){
		cpu.log(
			"DUMP: <br/>" + 
			"ip: " + cpu.ip + "<br />" + 
			"is: " + cpu.is + "<br />" + 
			"r0: " + cpu.r0 + "<br />" + 
			"r1: " + cpu.r1 + "<br />"
			);
	},

	step:function(){
		// store op
		cpu.is = program[cpu.ip];
		// cpu.log("is: " + cpu.is);
	
		// run op
		var func = cpu.getOpIdx(cpu.is);
		// cpu.log("CALLING: " + func);
		cpu.ops[func]();

		cpu.ip++;
		if(cpu.is > 7){
			// 2-byte op
			cpu.ip++;
		}
	},

	getOpIdx: function(op){
		switch(op){
			case 0: return 'halt';
			case 1: return 'add';
			case 2: return 'sub';
			case 3: return 'inc_r0';
			case 4: return 'inc_r1';
			case 5: return 'dec_r0';
			case 6: return 'dec_r1';
			case 7: return 'ring';
			case 8: return 'print';
			case 9: return 'ld_r0';
			case 10: return 'ld_r1';
			case 11: return 'sd_r0';
			case 12: return 'sd_r1';
			case 13: return 'jmp';
			case 14: return 'jmp_e';
			case 15: return 'jmp_a';
		}
	},

	ops:{
		// 1-byte instructions
		halt: function(){	
			// nothing
		},
		add: function(){	
			cpu.r0 = cpu.r0 + cpu.r1;	
		},
		sub: function(){	
			cpu.r0 = cpu.r0 - cpu.r1;		
		},
		inc_r0: function(){		
			cpu.r0++;
		},
		inc_r1: function(){		
			cpu.r1++;
		},
		dec_r0: function(){		
			cpu.r0--;
		},
		dec_r1: function(){		
			cpu.r1--;
		},
		ring: function(){	
			cpu.log("BEEP!");	
		},

		// 2-byte instructions
		print: function(){
			cpu.log("PRINT: " + program[cpu.ip + 1]);
		},
		ld_r0: function(){
			cpu.r0 = program[cpu.ip + 1];
		},
		ld_r1: function(){
			cpu.r1 = program[cpu.ip + 1];
		},
		sd_r0: function(){
			program[program[cpu.ip + 1]] = cpu.r0;
		},
		sd_r1: function(){
			program[program[cpu.ip + 1]] = cpu.r1;
		},
		jmp: function(){
			cpu.ip = program[cpu.ip + 1];
		},
		jmp_e: function(){
			if(cpu.r0 == 0){
				cpu.ip = program[cpu.ip + 1];
			}
		},
		jmp_a: function(){
			if(cpu.r0 != 0){
				cpu.ip = program[cpu.ip + 1];
			}
		}
	}
}
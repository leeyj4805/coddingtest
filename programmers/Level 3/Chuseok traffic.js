// 문제 
// 이번 추석에도 시스템 장애가 없는 명절을 보내고 싶은 어피치는 
// 서버를 증설해야 할지 고민이다. 장애대비용 서버 증설 여부를 결정하기 위해서 
// 작년 추석기간인 9/15일 로그 데이터를 분석한 후 초당 최대 처리량을 계산해보기로 했다.
// 초당 최대 처리량은 요청의 응답 완료 여부에 관계없이 임의 시간부터 1초 (=1,000밀리초)간 처리하는 요청의 
// 최대 개수를 의미하고 있습니다.



function solution(lines) {
    let ans = 0;
    const arr = [];
  
    /* 주어진 문자열 파싱
    ------------------------------------------*/
  
    lines.forEach(v => {
      const date = v.split(' ');
      const time = date[1].split(':');
      const mil = parseFloat(date[2].substr(0, date[2].length - 1)) * 1000;
  
      let s = 3600;
      let sec = 0;
      time.forEach(t => {
        sec += parseFloat(t) * s * 1000;
        s /= 60;
      });
      arr.push([sec - mil + 1, sec]); // [ 요청 발생 시간, 요청에 대한 응답 완료시간  ]
    });
  
  
    /* 알고리즘 부분
    ------------------------------------------*/
    arr.sort((a, b) => (a[0] < b[0] ? -1 : 1)); // 요청 발생시간 기준 오름차순 정렬.
  
    const pq = [];  //우선순위 큐
  
    let time = arr[0][0]; // 1초 범위 계산시 기준
  
    for (let v of arr) { // 요청의 발생, 완료 시간이 담긴 배열 순회.
  
      if (time + 999 < v[0]) { //1초 범위를 벗어난다면 해당 조건문에 입장, 1초 범위 내에 있다면 조건문을 수행하지 않고 pq에 완료시간 삽입.
  
        while (pq[0] + 999 < v[0] && pq.length > 0) pq.shift(); 
        //pq의 값중 우선순위가 가장 높은 값(응답 완료시간이 가장 높은 값)을 기준으로 1초 범위 내에 벗어나는 값들을 제거한다.
  
        time = pq.length === 0 ? v[0] : pq[0];
        // pq 내부에 값이 남아있다면 그 값들중 가장 우선순위가 높은 값으로, pq가 비어있다면 현 시점 바라보고 있는 요청의 발생시간을 삽입한다.
      }
      const newIdx = pq.findIndex(i => i > v[1]);
      // 우선순위 큐에 값을 삽입하기 위해서 위치를 찾는다.
  
      pq.splice(newIdx === -1 ? pq.length : newIdx, 0, v[1]);
      // 값을 삽입한다.
  
      ans = Math.max(ans, pq.length);
    }
    return ans;
  }
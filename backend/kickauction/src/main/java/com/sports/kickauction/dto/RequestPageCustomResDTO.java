package com.sports.kickauction.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class RequestPageCustomResDTO<E> {

    private List<E> dtoList;

    private int totalPage;
    private int currentPage;
    private int size;
    private int totalCount;

    private boolean prev;
    private boolean next;

    private int prevPage;
    private int nextPage;

    private List<Integer> pageList;

    @Builder
    public RequestPageCustomResDTO(List<E> dtoList, RequestPageCustomReqDTO requestPageCustomReqDTO, long totalCount) {
        this.dtoList = dtoList;
        this.totalCount = (int) totalCount;
        this.size = requestPageCustomReqDTO.getSize();
        this.currentPage = requestPageCustomReqDTO.getPage();

        this.totalPage = (int) Math.ceil((double) totalCount / size);

        //  페이지 블럭 단위 계산 (3개씩)
        int blockSize = 3;
        int tempEnd = (int)(Math.ceil(currentPage / (double) blockSize)) * blockSize;
        int start = tempEnd - (blockSize - 1);
        int end = Math.min(tempEnd, totalPage);

        //  페이지 번호 리스트
        this.pageList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());

        //  이전/다음 페이지 존재 여부
        this.prev = this.currentPage > 1;
        this.next = this.currentPage < this.totalPage;

        //  단순 페이지 이동용 prevPage/nextPage (블럭 단위)
        this.prevPage = start - 1;
        this.nextPage = end + 1;
    }
}
